from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

from app.config import settings
from app.database import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup aur shutdown events"""
    print("🇵🇰 Starting Discover Pakistan AI Travel Guide...")
    await create_tables()
    print("✅ API ready at http://localhost:8000/docs")
    yield
    print("👋 Shutting down...")


app = FastAPI(
    title="Discover Pakistan — AI Travel Guide",
    description="""
## 🇵🇰 Discover Pakistan — AI-Powered Travel Guide API

Pakistan ke tourists aur travelers ke liye ek complete travel guide platform.

### Features:
- 🔐 **JWT Authentication** — Secure register/login
- 🤖 **AI Travel Chatbot** — Google Gemini powered, Pakistan-specific
- 📡 **SSE Streaming** — Real-time chatbot responses  
- 📄 **RAG Pipeline** — Pakistan travel data se intelligent answers
- ⭐ **Rate Limiting** — 50 requests per hour per user

### AI Chatbot kya kar sakta hai:
- Pakistani cities aur tourist destinations recommend karna
- Best travel season aur budget batana
- Local food aur culture ke baare mein guide karna
- Urdu phrases tourists ko sikhana
- Hotel aur restaurant suggestions dena
- Safety tips aur travel advice dena
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — Frontend ko backend call karne do
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers register karo
from app.auth.router import router as auth_router
from app.chat.router import router as chat_router
from app.rag.router  import router as rag_router

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/chat", tags=["Travel Chatbot"])
app.include_router(rag_router,  prefix="/rag",  tags=["Pakistan Travel Data / RAG"])


@app.get("/health", tags=["System"])
async def health_check():
    """Backend ka health status check karo"""
    return {
        "status":   "healthy",
        "project":  "Discover Pakistan — AI Travel Guide",
        "version":  "1.0.0",
        "features": [
            "jwt-auth",
            "gemini-ai-chatbot",
            "rag-pipeline",
            "sse-streaming",
            "pakistan-travel-data"
        ],
        "ai_model": "Google Gemini 2.0 Flash",
        "purpose":  "AI-powered travel guide for Pakistan tourists"
    }


@app.get("/", tags=["System"])
async def root():
    """Root endpoint — frontend serve karo ya API info do"""
    if os.path.exists("index.html"):
        return FileResponse("index.html")
    return {
        "message": "🇵🇰 Discover Pakistan — AI Travel Guide API",
        "docs":    "/docs",
        "health":  "/health",
        "project": "Final Year Project — BSCSF2022, Govt. Graduate College for Women, Sheikhupura"
    }