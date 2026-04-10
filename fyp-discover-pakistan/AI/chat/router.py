import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession

from app.chat.service import chat_service
from app.database import get_db
from app.rag.service import rag_service

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Travel Chatbot"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class CreateConversationRequest(BaseModel):
    title: str = "New Travel Chat"


class SendMessageRequest(BaseModel):
    message: str
    use_rag: bool = True


class ConversationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())
    id:         int
    title:      str
    model_used: str


class MessageResponse(BaseModel):
    response:    str
    tokens_used: int
    model:       str
    rag_used:    bool = False


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/conversations", response_model=ConversationResponse, status_code=201)
async def create_conversation(
    data: CreateConversationRequest,
    db: AsyncSession = Depends(get_db),
):
    conv = await chat_service.create_conversation(title=data.title, db=db)
    return ConversationResponse.model_validate(conv)


@router.get("/conversations", response_model=list[ConversationResponse])
async def list_conversations(db: AsyncSession = Depends(get_db)):
    convs = await chat_service.get_all_conversations(db)
    return [ConversationResponse.model_validate(c) for c in convs]


@router.post("/conversations/{conversation_id}", response_model=MessageResponse)
async def send_message(
    conversation_id: int,
    data: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
):
    history = await chat_service.get_conversation_history(conversation_id, db)

    rag_context = None
    rag_used    = False
    if data.use_rag:
        results = await rag_service.search_documents(
            query=data.message,
            db=db,
        )
        if results:
            rag_context = "\n\n---\n\n".join([
                f"Source: {r['filename']}\n{r['content']}" for r in results
            ])
            rag_used = True

    result = await chat_service.chat(
        user_message=data.message,
        history=history,
        rag_context=rag_context,
    )

    await chat_service.save_messages(
        conversation_id=conversation_id,
        user_message=data.message,
        assistant_message=result["content"],
        tokens_used=result["tokens_used"],
        db=db,
    )

    return MessageResponse(
        response=result["content"],
        tokens_used=result["tokens_used"],
        model=result["model"],
        rag_used=rag_used,
    )


@router.post("/conversations/{conversation_id}/stream")
async def stream_message(
    conversation_id: int,
    data: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
):
    history = await chat_service.get_conversation_history(conversation_id, db)

    rag_context = None
    if data.use_rag:
        results = await rag_service.search_documents(query=data.message, db=db)
        if results:
            rag_context = "\n\n---\n\n".join([
                f"Source: {r['filename']}\n{r['content']}" for r in results
            ])

    collected = []

    async def event_generator():
        async for chunk in chat_service.stream(
            user_message=data.message,
            history=history,
            rag_context=rag_context,
        ):
            collected.append(chunk)
            yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"

        yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"

        full = "".join(collected)
        try:
            await chat_service.save_messages(
                conversation_id=conversation_id,
                user_message=data.message,
                assistant_message=full,
                tokens_used=len(full) // 4,
                db=db,
            )
        except Exception as e:
            logger.error(f"Save error: {e}")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )