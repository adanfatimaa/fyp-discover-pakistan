import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text
from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id         = Column(Integer, primary_key=True, index=True)
    filename   = Column(String(255))
    content    = Column(Text, nullable=False)
    embedding  = Column(Text)
    chunk_idx  = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<Document id={self.id} file={self.filename}>"