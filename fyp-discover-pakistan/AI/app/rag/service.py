import json
import logging
import math

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.rag.models import Document

logger = logging.getLogger(__name__)
_embedder = None


def get_embedder():
    global _embedder
    if _embedder is None:
        from sentence_transformers import SentenceTransformer
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Embedding model loaded!")
    return _embedder


class RAGService:

    def chunk_text(self, text: str, chunk_size: int = 400, overlap: int = 50) -> list[str]:
        words  = text.split()
        chunks = []
        start  = 0
        while start < len(words):
            chunks.append(" ".join(words[start:start + chunk_size]))
            start += chunk_size - overlap
        return chunks

    def embed_text(self, text: str) -> list[float]:
        return get_embedder().encode(text, normalize_embeddings=True).tolist()

    def cosine_similarity(self, v1: list[float], v2: list[float]) -> float:
        dot = sum(a * b for a, b in zip(v1, v2))
        m1  = math.sqrt(sum(a * a for a in v1))
        m2  = math.sqrt(sum(b * b for b in v2))
        return dot / (m1 * m2) if m1 and m2 else 0.0

    async def index_document(
        self, content: str, filename: str, db: AsyncSession
    ) -> int:
        chunks = self.chunk_text(content)
        for i, chunk in enumerate(chunks):
            db.add(Document(
                filename=filename,
                content=chunk,
                embedding=json.dumps(self.embed_text(chunk)),
                chunk_idx=i,
            ))
        await db.commit()
        logger.info(f"Indexed {len(chunks)} chunks for '{filename}'")
        return len(chunks)

    async def search_documents(
        self, query: str, db: AsyncSession,
        top_k: int = 3, min_similarity: float = 0.3
    ) -> list[dict]:
        query_emb = self.embed_text(query)
        result    = await db.execute(select(Document))
        docs      = result.scalars().all()

        scored = []
        for doc in docs:
            if not doc.embedding:
                continue
            sim = self.cosine_similarity(query_emb, json.loads(doc.embedding))
            if sim >= min_similarity:
                scored.append({
                    "content":    doc.content,
                    "filename":   doc.filename,
                    "chunk_idx":  doc.chunk_idx,
                    "similarity": round(sim, 4),
                })

        scored.sort(key=lambda x: x["similarity"], reverse=True)
        return scored[:top_k]

    async def get_all_documents(self, db: AsyncSession) -> list[dict]:
        result = await db.execute(
            select(Document.filename, Document.created_at)
            .order_by(Document.created_at.desc())
        )
        seen, files = set(), []
        for row in result.fetchall():
            if row.filename not in seen:
                seen.add(row.filename)
                files.append({"filename": row.filename, "created_at": str(row.created_at)})
        return files


rag_service = RAGService()