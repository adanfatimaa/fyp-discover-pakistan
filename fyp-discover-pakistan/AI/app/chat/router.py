import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from groq import RateLimitError

from app.chat.service import chat_service
from app.database import get_db
from app.rag.service import rag_service

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Travel Chatbot"])



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
    try:
        history = await chat_service.get_conversation_history(conversation_id, db)

        rag_context = None
        rag_used    = False
        if data.use_rag:
            results = await rag_service.search_documents(query=data.message, db=db)
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

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="AI is busy right now (rate limit). Please wait a minute and try again."
        )
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


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
        try:
            async for chunk in chat_service.stream(
                user_message=data.message,
                history=history,
                rag_context=rag_context,
            ):
                collected.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"

            yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"

            full = "".join(collected)
            await chat_service.save_messages(
                conversation_id=conversation_id,
                user_message=data.message,
                assistant_message=full,
                tokens_used=len(full) // 4,
                db=db,
            )

        except Exception as e:
            logger.error(f"Stream error: {e}")
            yield f"data: {json.dumps({'chunk': '[Error occurred]', 'done': True})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


#  frontend chatbot.js 
class SimpleChatRequest(BaseModel):
    message: str


@router.post("/message")
async def simple_chat(
    data: SimpleChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Frontend chatbot.js ke liye simple endpoint.
    Conversation history maintain nahi karta — stateless.
    """
    try:
        results = await rag_service.search_documents(query=data.message, db=db)
        rag_context = None
        if results:
            rag_context = "\n\n---\n\n".join([
                f"Source: {r['filename']}\n{r['content']}" for r in results
            ])

        result = await chat_service.chat(
            user_message=data.message,
            history=[],
            rag_context=rag_context,
        )
        return {"reply": result["content"]}

    except RateLimitError:
        return JSONResponse(
            status_code=429,
            content={"reply": "I'm a little busy right now! Please try again in a minute. 😊"}
        )
    except Exception as e:
        logger.error(f"Simple chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={"reply": "Oops! Something went wrong. Please try again."}
        )


class MoodRequest(BaseModel):
    mood: str
    budget: str = ""
    duration: str = ""


@router.post("/recommendations")
async def mood_recommendations(
    data: MoodRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Mood-based travel recommendations via AI + RAG.
    Frontend recommendation.js se call hoga.
    """
    try:
        query = f"Recommend destinations for {data.mood} travel"
        if data.budget:
            query += f" with {data.budget} budget"
        if data.duration:
            query += f" for {data.duration} trip"

        results = await rag_service.search_documents(query=query, db=db, top_k=5)
        rag_context = None
        if results:
            rag_context = "\n\n---\n\n".join([
                f"Source: {r['filename']}\n{r['content']}" for r in results
            ])

        prompt = f"""
User wants {data.mood} travel in Pakistan.
Budget: {data.budget or 'not specified'}
Duration: {data.duration or 'not specified'}

Give exactly 3 destination recommendations in this JSON format only, no extra text:
{{
  "recommendations": [
    {{
      "name": "City/Place Name",
      "province": "Province Name",
      "description": "2-3 sentences why it matches this mood",
      "bestFor": "{data.mood}",
      "estimatedBudget": "PKR amount range",
      "bestSeason": "Season info",
      "image": "images/cityname.jpg",
      "slug": "cityslug"
    }}
  ]
}}
"""
        result = await chat_service.chat(
            user_message=prompt,
            history=[],
            rag_context=rag_context,
        )

        # JSON parse try karo
        import re
        content = result["content"]
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            import json
            recommendations = json.loads(json_match.group())
            return recommendations
        else:
            return {"reply": content}  # fallback: raw text

    except RateLimitError:
        return JSONResponse(
            status_code=429,
            content={"error": "AI busy. Please try again in a minute."}
        )
    except Exception as e:
        logger.error(f"Recommendations error: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )