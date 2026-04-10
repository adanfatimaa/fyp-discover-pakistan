import logging
from typing import AsyncGenerator

from groq import Groq
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.chat.models import Conversation, Message
from app.config import settings

logger = logging.getLogger(__name__)

groq_client = Groq(api_key=settings.GROQ_API_KEY)

PAKISTAN_TRAVEL_SYSTEM_PROMPT = """
You are an AI-powered travel guide assistant for "Discover Pakistan" —
a web-based tourism platform helping tourists explore Pakistan.

Your role is to help domestic and international tourists plan trips across
Pakistan by providing accurate, helpful, and positive travel information.

== WHAT YOU HELP WITH ==
1. Tourist destinations: Hunza, Skardu, Lahore, Karachi, Islamabad, Peshawar, Quetta, Swat, Naran
2. Travel planning: best season, budget in PKR, transport options
3. Food & cuisine: Nihari, Karahi, Chapli Kebab, Sajji, Biryani
4. Hotels: Pearl Continental, Serena Hotels, PTDC Motels, local guesthouses
5. Culture & etiquette: dress code, mosque rules, Ramadan tips
6. Basic Urdu phrases for tourists
7. Safety tips and practical travel advice

== RULES ==
- Always be positive and accurate about Pakistan
- If RAG context is provided, use it as PRIMARY source
- Give specific names of places, restaurants, hotels
- Mention prices in PKR where possible
- Keep responses friendly and structured

== ABOUT ==
Discover Pakistan — Final Year Project, BSCSF2022,
Govt. Graduate College for Women, Sheikhupura, University of Punjab.
Supervisor: Ms. Umm e Hani
Team: Aisha Amir, Adan Fatima, Seeman Bibi, Sidra Ghafoor
"""


class ChatService:

    # ── History ────────────────────────────────────────────────────────────────
    async def get_conversation_history(
        self, conversation_id: int, db: AsyncSession, limit: int = 10
    ) -> list[dict]:
        result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
        )
        messages = result.scalars().all()
        messages.reverse()
        return [{"role": m.role, "content": m.content} for m in messages]

    async def save_messages(
        self,
        conversation_id: int,
        user_message: str,
        assistant_message: str,
        tokens_used: int,
        db: AsyncSession,
    ):
        db.add_all([
            Message(conversation_id=conversation_id, role="user",
                    content=user_message),
            Message(conversation_id=conversation_id, role="assistant",
                    content=assistant_message, tokens_used=tokens_used,
                    model_used=settings.GROQ_MODEL),
        ])
        await db.commit()

    # ── Conversation CRUD ──────────────────────────────────────────────────────
    async def create_conversation(
        self, title: str, db: AsyncSession
    ) -> Conversation:
        conv = Conversation(title=title, model_used=settings.GROQ_MODEL)
        db.add(conv)
        await db.commit()
        await db.refresh(conv)
        return conv

    async def get_all_conversations(self, db: AsyncSession) -> list[Conversation]:
        result = await db.execute(
            select(Conversation).order_by(Conversation.updated_at.desc())
        )
        return result.scalars().all()

    # ── Helper: messages list banana ──────────────────────────────────────────
    def _build_messages(
        self,
        user_message: str,
        history: list[dict],
        system_prompt: str,
        rag_context: str = None,
    ) -> list[dict]:
        prompt = system_prompt
        if rag_context:
            prompt += f"""

== RETRIEVED TRAVEL DATA (RAG) ==
{rag_context}
== END OF RETRIEVED DATA ==
Above data ke basis pe user ka sawal answer karo.
"""
        messages = [{"role": "system", "content": prompt}]
        for msg in history[-6:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": user_message})
        return messages

    # ── Normal Chat ────────────────────────────────────────────────────────────
    async def chat(
        self,
        user_message: str,
        history: list[dict],
        rag_context: str = None,
        system_prompt: str = None,
    ) -> dict:
        messages = self._build_messages(
            user_message,
            history,
            system_prompt or PAKISTAN_TRAVEL_SYSTEM_PROMPT,
            rag_context,
        )
        try:
            response = groq_client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                max_tokens=1024,
                temperature=0.7,
            )
            return {
                "content":       response.choices[0].message.content,
                "tokens_used":   response.usage.total_tokens,
                "model":         response.model,
                "finish_reason": response.choices[0].finish_reason,
            }
        except Exception as e:
            logger.error(f"Groq Error: {e}")
            raise

    # ── Streaming Chat ─────────────────────────────────────────────────────────
    async def stream(
        self,
        user_message: str,
        history: list[dict],
        rag_context: str = None,
        system_prompt: str = None,
    ) -> AsyncGenerator[str, None]:
        messages = self._build_messages(
            user_message,
            history,
            system_prompt or PAKISTAN_TRAVEL_SYSTEM_PROMPT,
            rag_context,
        )
        try:
            stream = groq_client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                max_tokens=1024,
                temperature=0.7,
                stream=True,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta
        except Exception as e:
            logger.error(f"Groq Stream Error: {e}")
            yield f"\n[Error: {str(e)}]"


chat_service = ChatService()