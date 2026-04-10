import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.service import get_current_user
from app.cache.service import cache_service
from app.chat.service import chat_service
from app.database import get_db
from app.rag.service import rag_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Travel Chatbot"])


# ─── Request / Response Schemas ───────────────────────────────────────────────

class CreateConversationRequest(BaseModel):
    title: str = "New Travel Chat"
    model: str = "gemini-2.0-flash"  # Gemini default (gpt-4o-mini se change kiya)


class SendMessageRequest(BaseModel):
    message: str
    # use_rag default True rakha — Pakistan travel data hamesha search ho
    # Iska matlab: user ke sawal ke mutabiq relevant Pakistan info automatically mile
    use_rag: bool = True
    model: str = "gemini-2.0-flash"


class ConversationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id:         int
    title:      str
    model_used: str


class MessageResponse(BaseModel):
    response:    str
    tokens_used: int
    model:       str
    cached:      bool = False
    rag_used:    bool = False   # Batata hai ke RAG use hua ya nahi


def get_user_id(current_user: dict) -> int:
    return int(current_user["sub"])


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=201,
    summary="Naya Travel Chat Banao",
    description="Naya conversation thread start karo — user apna travel plan discuss kar sakta hai",
)
async def create_conversation(
    data: CreateConversationRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conv = await chat_service.create_conversation(
        user_id=get_user_id(current_user),
        title=data.title,
        model=data.model,
        db=db,
    )
    return ConversationResponse.model_validate(conv)


@router.get(
    "/conversations",
    response_model=list[ConversationResponse],
    summary="Apni Travel Conversations Dekho",
    description="Is user ki saari chat conversations list karo",
)
async def list_conversations(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    convs = await chat_service.get_user_conversations(get_user_id(current_user), db)
    return [ConversationResponse.model_validate(c) for c in convs]


@router.post(
    "/conversations/{conversation_id}",
    response_model=MessageResponse,
    summary="Travel Question Pucho (Normal)",
    description="""
Pakistan travel ke baare mein sawaal pucho — non-streaming response.

**RAG Pipeline (use_rag=True — Default):**
1. User ka question → semantic search Pakistan travel database mein
2. Relevant chunks (destinations, food, hotels, culture) retrieve hoti hain
3. Woh context + Pakistan system prompt + user question → Gemini ko bheja jata hai
4. Gemini accurate, data-backed Pakistan travel answer deta hai

**Bina RAG (use_rag=False):**
- Sirf Gemini ki training + Pakistan system prompt se jawab
    """,
)
async def send_message(
    conversation_id: int,
    data: SendMessageRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_id = get_user_id(current_user)

    # Rate limiting check
    allowed, remaining = await cache_service.check_rate_limit(user_id)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Bohot zyada requests. 1 ghante mein 50 allowed hain.",
        )

    # Chat history fetch karo
    history = await chat_service.get_conversation_history(conversation_id, db)

    # ── RAG Pipeline ──────────────────────────────────────────────────────────
    # Yeh core feature hai: user ke sawaal se related Pakistan travel data
    # automatically retrieve hota hai aur Gemini ko context diya jata hai
    rag_context = None
    rag_used    = False

    if data.use_rag:
        logger.info(f"RAG search: '{data.message[:50]}...'")
        results = await rag_service.search_documents(
            query=data.message,
            user_id=user_id,
            db=db,
        )
        if results:
            # Top results ko ek string mein combine karo
            rag_context = "\n\n---\n\n".join([
                f"Source: {r['filename']} (similarity: {r['similarity']})\n{r['content']}"
                for r in results
            ])
            rag_used = True
            logger.info(f"RAG: {len(results)} relevant chunks mile")

    # ── Gemini ko call karo ───────────────────────────────────────────────────
    result = await chat_service.chat_openai(
        user_message=data.message,
        history=history,
        model=data.model,
        # system_prompt=None → automatically PAKISTAN_TRAVEL_SYSTEM_PROMPT use hogi
    )

    # Messages database mein save karo
    await chat_service.save_messages(
        conversation_id=conversation_id,
        user_message=data.message,
        assistant_message=result["content"],
        tokens_used=result["tokens_used"],
        model=data.model,
        db=db,
    )

    return MessageResponse(
        response=result["content"],
        tokens_used=result["tokens_used"],
        model=result["model"],
        cached="from_cache" in result,
        rag_used=rag_used,
    )


@router.post(
    "/conversations/{conversation_id}/stream",
    summary="Travel Question Pucho (Streaming)",
    description="""
ChatGPT-style real-time streaming response.

**Yeh endpoint kaise kaam karta hai:**

1. User Pakistan travel sawaal bhejta hai
2. RAG pipeline Pakistan travel database search karti hai (agar use_rag=True)
3. Relevant data (destinations, food, hotels, culture info) retrieve hoti hai
4. Gemini Pakistan system prompt + retrieved data ke saath response generate karta hai
5. Response token by token SSE format mein stream hota hai

**SSE Format:**
```
data: {"chunk": "Hunza", "done": false}
data: {"chunk": " Valley", "done": false}  
data: {"chunk": " is one of", "done": false}
data: {"chunk": "", "done": true}
```
    """,
)
async def stream_message(
    conversation_id: int,
    data: SendMessageRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_id = get_user_id(current_user)

    # Rate limit check
    allowed, _ = await cache_service.check_rate_limit(user_id)
    if not allowed:
        raise HTTPException(429, "Rate limit exceed ho gaya. Thodi der baad try karo.")

    # Chat history
    history = await chat_service.get_conversation_history(conversation_id, db)

    # ── RAG Pipeline ──────────────────────────────────────────────────────────
    # Streaming mein bhi RAG same tarike se kaam karta hai
    # Difference sirf yeh hai ke response streaming hoti hai
    rag_context = None

    if data.use_rag:
        logger.info(f"Streaming RAG search: '{data.message[:50]}...'")
        results = await rag_service.search_documents(
            query=data.message,
            user_id=user_id,
            db=db,
        )
        if results:
            rag_context = "\n\n---\n\n".join([
                f"Source: {r['filename']} (similarity: {r['similarity']})\n{r['content']}"
                for r in results
            ])
            logger.info(f"Streaming RAG: {len(results)} chunks mile, context ready")

    collected_response = []

    async def event_generator():
        """
        SSE event generator — Gemini se chunks lo aur turant frontend ko bhejo.

        Yeh async generator hai jo:
        1. chat_service.stream_openai() se chunks leta hai
        2. Har chunk ko JSON format mein wrap karta hai
        3. 'data: ...' format mein yield karta hai (SSE protocol)
        4. Akhir mein done=True bhejta hai
        5. Poora response database mein save karta hai
        """
        nonlocal collected_response

        async for chunk in chat_service.stream_openai(
            user_message=data.message,
            history=history,
            model=data.model,
            rag_context=rag_context,
            # system_prompt=None → PAKISTAN_TRAVEL_SYSTEM_PROMPT automatically use hogi
        ):
            collected_response.append(chunk)
            event_data = json.dumps({"chunk": chunk, "done": False})
            yield f"data: {event_data}\n\n"

        # Stream khatam hone ka signal
        yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"

        # Streaming ke baad poora response save karo
        full_response = "".join(collected_response)
        try:
            await chat_service.save_messages(
                conversation_id=conversation_id,
                user_message=data.message,
                assistant_message=full_response,
                tokens_used=len(full_response) // 4,  # Approximate token count
                model=data.model,
                db=db,
            )
            logger.info(f"Streaming message saved — {len(full_response)} chars")
        except Exception as e:
            logger.error(f"Streaming message save error: {e}")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control":       "no-cache",
            "X-Accel-Buffering":   "no",       # Nginx buffering band karo
            "Access-Control-Allow-Origin": "*",
        },
    )