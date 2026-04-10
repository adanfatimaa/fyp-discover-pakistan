from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

from app.config import settings
from app.database import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting Discover Pakistan AI Travel Guide...")
    await create_tables()
    print("API ready at http://localhost:8000/docs")
    yield
    print("Shutting down...")


app = FastAPI(
    title="Discover Pakistan — AI Travel Guide",
    description="Pakistan ke tourists ke liye AI-powered travel guide.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers — auth router hata diya
from app.chat.router import router as chat_router
from app.rag.router  import router as rag_router

app.include_router(chat_router, prefix="/chat", tags=["Travel Chatbot"])
app.include_router(rag_router,  prefix="/rag",  tags=["Pakistan Travel Data / RAG"])


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status":   "healthy",
        "project":  "Discover Pakistan — AI Travel Guide",
        "version":  "1.0.0",
        "ai_model": f"Groq / {settings.GROQ_MODEL}",
    }


@app.get("/", tags=["System"])
async def root():
    if os.path.exists("index.html"):
        return FileResponse("index.html")
    return {
        "message": "Discover Pakistan — AI Travel Guide API",
        "docs":    "/docs",
    }