import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


async def setup():
    print("=" * 50)
    print("Discover Pakistan — Data Setup")
    print("=" * 50)

    from app.database import create_tables, AsyncSessionLocal
    from app.rag.service import rag_service

    await create_tables()
    print("Database ready.")

    data_folder = os.path.join(os.path.dirname(__file__), "pakistan_data")
    if not os.path.exists(data_folder):
        print(f"Error: {data_folder} folder nahi mila!")
        return

    data_files = [f for f in os.listdir(data_folder) if f.endswith('.txt')]
    if not data_files:
        print("Koi .txt file nahi mili!")
        return

    total = 0
    async with AsyncSessionLocal() as db:
        for filename in data_files:
            filepath = os.path.join(data_folder, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if len(content.strip()) < 50:
                continue
            print(f"Indexing: {filename}...")
            chunks = await rag_service.index_document(
                content=content, filename=filename, db=db
            )
            total += chunks
            print(f"  {chunks} chunks indexed.")

    print(f"\nDone! Total chunks: {total}")
    print("Server start karo: uvicorn app.main:app --reload")


if __name__ == "__main__":
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass
    asyncio.run(setup())