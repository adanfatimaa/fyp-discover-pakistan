import logging
from typing import AsyncGenerator

import google.generativeai as genai
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.chat.models import Conversation, Message
from app.config import settings

logger = logging.getLogger(__name__)

# ─── Gemini API setup ────────────────────────────────────────────────────────
genai.configure(api_key=settings.GEMINI_API_KEY)


# ─── Pakistan Travel System Prompt ───────────────────────────────────────────
# Yeh prompt Gemini ko batata hai ke woh Discover Pakistan ka AI travel guide
# hai. Iske bina Gemini generic assistant ki tarah behave karta — iske saath
# woh Pakistan-specific, helpful, aur accurate travel advice deta hai.
# RAG context bhi isi prompt ke saath combine hoti hai jab user kuch poochhe.

PAKISTAN_TRAVEL_SYSTEM_PROMPT = """
You are an AI-powered travel guide assistant for "Discover Pakistan" — 
a web-based tourism platform helping tourists explore Pakistan.

Your role is to help domestic and international tourists plan trips across 
Pakistan by providing accurate, helpful, and positive travel information.

== WHAT YOU HELP WITH ==
1. Tourist Destination Recommendations
   - Cities: Lahore, Karachi, Islamabad, Peshawar, Quetta, Multan, Faisalabad
   - Northern Areas: Hunza, Skardu, Gilgit, Swat, Chitral, Naran, Kaghan
   - Historical: Mohenjo-Daro, Taxila, Lahore Fort, Rohtas Fort
   - Religious: Badshahi Mosque, Data Darbar, Faisal Mosque, Hinglaj Mandir

2. Travel Planning
   - Best season to visit each location
   - Estimated travel budget in PKR
   - How to reach destinations (road, air, train)
   - Recommended trip duration

3. Food & Cuisine
   - Lahore: Nihari, Paye, Lahori Chargha, Halwa Puri, Siri Paye
   - Karachi: Biryani, Bun Kebab, Karachi BBQ, Seekh Kebab
   - Peshawar: Chapli Kebab, Peshawari Karahi, Dum Pukht
   - Northern Pakistan: Hunza water, Chapshuro, Diram Phiti, Mamtu
   - General: Sajji (Balochistan), Sindhi Biryani, Haleem, Mutton Karahi

4. Hotels & Accommodation
   - Luxury: Pearl Continental (Lahore/Karachi), Serena Hotels (Islamabad/Quetta)
   - Mid-range: Avari Hotels, Best Western, local guest houses
   - Budget: Government rest houses, hostels in northern areas
   - Northern areas: PTDC motels, local home stays in Hunza/Skardu

5. Culture & Etiquette Tips
   - Dress modestly, especially at religious sites
   - Greet with "Assalam-o-Alaikum"
   - Remove shoes before entering mosques
   - Ask permission before photographing locals
   - Ramadan travel etiquette (eat discreetly in public)
   - Bargaining is normal in bazaars

6. Basic Urdu Phrases for Tourists
   - Hello: Assalam-o-Alaikum
   - Thank you: Shukriya
   - How much?: Kitna hai?
   - Where is...?: ... kahan hai?
   - Please help me: Mujhe madad chahiye
   - Good food: Khana acha hai
   - Water: Paani
   - Toilet: Bathroom / Washroom

7. Safety & General Tips
   - Register with PTDC (Pakistan Tourism Development Corporation)
   - Keep copies of important documents
   - Travel in groups to remote areas
   - Check weather before visiting northern areas (road closures in winter)
   - Best months for northern Pakistan: May to October
   - Best months for southern Pakistan: November to February

== IMPORTANT RULES ==
- Always be POSITIVE and ACCURATE about Pakistan
- Counter misinformation with facts about Pakistan's safety and hospitality
- If asked about something outside Pakistan travel, politely redirect
- If RAG context is provided, prioritize that information in your answer
- Give practical, specific advice with actual names of places/restaurants/hotels
- Mention prices in PKR where possible
- Keep responses friendly, clear, and structured

== ABOUT THE PLATFORM ==
Discover Pakistan is a Final Year Project by BSCSF2022 students at 
Govt. Graduate College for Women, Sheikhupura, University of Punjab, Lahore.
Supervisor: Ms. Umm e Hani
Team: Aisha Amir, Adan Fatima, Seeman Bibi, Sidra Ghafoor
"""


class ChatService:

    # ── History Management ────────────────────────────────────────────────────

    async def get_conversation_history(
        self,
        conversation_id: int,
        db: AsyncSession,
        limit: int = 10,
    ) -> list[dict]:
        """
        Last 10 messages fetch karo conversation ki history ke liye.
        Gemini ko context chahiye ke pehle kya baat hui thi.
        """
        result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
        )
        messages = result.scalars().all()
        messages.reverse()  # Purani messages pehle
        return [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]

    async def save_messages(
        self,
        conversation_id: int,
        user_message: str,
        assistant_message: str,
        tokens_used: int,
        model: str,
        db: AsyncSession,
    ):
        """
        User ka message aur AI ka reply dono database mein save karo.
        Yeh chat history maintain karne ke liye zaroori hai.
        """
        user_msg = Message(
            conversation_id=conversation_id,
            role="user",
            content=user_message,
        )
        assistant_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=assistant_message,
            tokens_used=tokens_used,
            model_used=model,
        )
        db.add_all([user_msg, assistant_msg])
        await db.commit()

    # ── Conversation CRUD ─────────────────────────────────────────────────────

    async def create_conversation(
        self,
        user_id: int,
        title: str,
        model: str,
        db: AsyncSession,
    ) -> Conversation:
        """Naya conversation thread banao database mein."""
        conv = Conversation(user_id=user_id, title=title, model_used=model)
        db.add(conv)
        await db.commit()
        await db.refresh(conv)
        return conv

    async def get_user_conversations(
        self, user_id: int, db: AsyncSession
    ) -> list[Conversation]:
        """Is user ki saari conversations fetch karo, latest pehle."""
        result = await db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
        )
        return result.scalars().all()

    async def verify_conversation_owner(
        self, conversation_id: int, user_id: int, db: AsyncSession
    ) -> Conversation:
        """Check karo ke yeh conversation is user ki hai ya nahi."""
        result = await db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id,
            )
        )
        conv = result.scalar_one_or_none()
        if not conv:
            from fastapi import HTTPException
            raise HTTPException(404, "Conversation nahi mili ya access nahi hai")
        return conv

    # ── Gemini Chat (Non-Streaming) ───────────────────────────────────────────

    async def chat_openai(
        self,
        user_message: str,
        history: list[dict],
        model: str = "gemini-2.0-flash",
        system_prompt: str = None,
    ) -> dict:
        """
        Normal (non-streaming) chat response.

        Flow:
        1. Pakistan system prompt set karo (ya custom prompt agar diya gaya)
        2. Chat history ko Gemini format mein convert karo
        3. Gemini ko message bhejo
        4. Response wapas karo

        system_prompt=None hone par PAKISTAN_TRAVEL_SYSTEM_PROMPT automatically use hogi.
        """
        try:
            # Pakistan prompt default hai — override sirf tab karo jab explicitly diya jaye
            active_prompt = system_prompt if system_prompt else PAKISTAN_TRAVEL_SYSTEM_PROMPT

            gemini_model = genai.GenerativeModel(
                model_name="gemini-2.0-flash",
                system_instruction=active_prompt,
            )

            # History ko Gemini format mein convert karo
            # Gemini "user"/"model" use karta hai, hamare DB mein "user"/"assistant" hai
            gemini_history = [
                {
                    "role":  "user" if msg["role"] == "user" else "model",
                    "parts": [msg["content"]]
                }
                for msg in history[-6:]  # Sirf last 6 messages context ke liye
            ]

            chat = gemini_model.start_chat(history=gemini_history)
            response = chat.send_message(user_message)

            return {
                "content":       response.text,
                "tokens_used":   0,
                "model":         "gemini-2.0-flash",
                "finish_reason": "stop",
            }

        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            raise

    # ── Gemini Streaming ──────────────────────────────────────────────────────

    async def stream_openai(
        self,
        user_message: str,
        history: list[dict],
        model: str = "gemini-2.0-flash",
        system_prompt: str = None,
        rag_context: str = None,
    ) -> AsyncGenerator[str, None]:
        """
        SSE Streaming chat response — token by token.

        RAG Pipeline flow (jab use_rag=True ho):
        1. User ka question aata hai
        2. Router mein RAG search hoti hai — similar Pakistan travel chunks milte hain
        3. Woh chunks yahan rag_context ke roop mein aate hain
        4. Pakistan system prompt + RAG context = enriched prompt
        5. Gemini is enriched prompt se accurate, data-backed answer deta hai
        6. Response token by token stream hota hai frontend ko

        Bina RAG ke (use_rag=False):
        - Sirf Pakistan system prompt use hoti hai
        - Gemini apni training se jawab deta hai
        """
        try:
            # Step 1: Base system prompt set karo
            active_prompt = system_prompt if system_prompt else PAKISTAN_TRAVEL_SYSTEM_PROMPT

            # Step 2: Agar RAG context hai to system prompt mein add karo
            # Yeh Gemini ko batata hai ke "yeh specifically retrieved data hai, ise prioritize karo"
            if rag_context:
                active_prompt += f"""

== RETRIEVED TRAVEL DATA (RAG) ==
The following information has been retrieved from the Discover Pakistan 
travel database. Use this as your PRIMARY source for answering:

{rag_context}

== END OF RETRIEVED DATA ==
Based on the above retrieved data and your knowledge, answer the user's question.
"""

            gemini_model = genai.GenerativeModel(
                model_name="gemini-2.0-flash",
                system_instruction=active_prompt,
            )

            # Step 3: History convert karo
            gemini_history = [
                {
                    "role":  "user" if msg["role"] == "user" else "model",
                    "parts": [msg["content"]]
                }
                for msg in history[-6:]
            ]

            chat = gemini_model.start_chat(history=gemini_history)

            # Step 4: Streaming response
            response = chat.send_message(user_message, stream=True)

            full_response = ""
            for chunk in response:
                if chunk.text:
                    full_response += chunk.text
                    yield chunk.text  # Har chunk frontend ko bhejo (SSE)

            logger.info(
                f"Pakistan Travel AI — Streaming complete. "
                f"RAG used: {bool(rag_context)}. "
                f"Total chars: {len(full_response)}"
            )

        except Exception as e:
            logger.error(f"Gemini Streaming Error: {e}")
            yield f"\n[Error: {str(e)}]"

    # ── Aliases (backward compatibility) ─────────────────────────────────────

    async def chat_anthropic(
        self,
        user_message: str,
        history: list[dict],
        system_prompt: str = None,
    ) -> dict:
        """Gemini use karta hai — naam purana raha compatibility ke liye."""
        return await self.chat_openai(
            user_message=user_message,
            history=history,
            model="gemini-2.0-flash",
            system_prompt=system_prompt,
        )

    async def stream_anthropic(
        self,
        user_message: str,
        history: list[dict],
        system_prompt: str = None,
    ) -> AsyncGenerator[str, None]:
        """Gemini streaming — naam purana raha compatibility ke liye."""
        async for chunk in self.stream_openai(
            user_message=user_message,
            history=history,
            system_prompt=system_prompt,
        ):
            yield chunk


# ─── Singleton instance ───────────────────────────────────────────────────────
chat_service = ChatService()