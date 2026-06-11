import logging
from fastapi import APIRouter, HTTPException, UploadFile, File, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.database import get_db
from app.rag.service import rag_service

logger = logging.getLogger(__name__)
router = APIRouter(tags=["RAG / Documents"])  # prefix hata diya — main.py mein hai

ALLOWED_TYPES = {"text/plain", "application/pdf", "text/markdown"}
MAX_FILE_SIZE = 5 * 1024 * 1024


class SearchRequest(BaseModel):
    query: str
    top_k: int = 3


@router.post("/upload", status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"Sirf TXT/MD files allowed hain.")

    content_bytes = await file.read()
    if len(content_bytes) > MAX_FILE_SIZE:
        raise HTTPException(400, "File bohot badi hai. Max 5 MB.")

    try:
        content = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(400, "File UTF-8 encoding mein honi chahiye.")

    if len(content.strip()) < 50:
        raise HTTPException(400, "File mein koi content nahi.")

    chunks_count = await rag_service.index_document(
        content=content,
        filename=file.filename,
        db=db,
    )
    return {
        "message":        f"'{file.filename}' indexed!",
        "chunks_created": chunks_count,
    }


@router.get("/docs")
async def list_documents(db: AsyncSession = Depends(get_db)):
    docs = await rag_service.get_all_documents(db)
    return {"documents": docs, "total": len(docs)}


@router.post("/search")
async def search_documents(
    data: SearchRequest,
    db: AsyncSession = Depends(get_db),
):
    results = await rag_service.search_documents(
        query=data.query, db=db, top_k=data.top_k
    )
    return {"query": data.query, "results": results, "count": len(results)}