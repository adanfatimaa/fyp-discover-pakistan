"""
================================================================
DISCOVER PAKISTAN — Pakistan Travel Data Setup Script
================================================================

Yeh script ek baar chalao — Pakistan travel data ko RAG pipeline
mein index kar dega taake chatbot accurate answers de sake.

Kaise kaam karta hai:
1. destinations.txt file padhi jati hai
2. Text chunks mein toot ta hai (har chunk 400 words)
3. Har chunk ka embedding banta hai (SentenceTransformers se)
4. Embeddings + text database mein store hote hain
5. Ab chatbot kisi bhi sawaal pe relevant chunks dhundh sakta hai

Chalane ka tarika:
    python setup_pakistan_data.py

Ya project root se:
    python -m app.setup_pakistan_data
================================================================
"""

import asyncio
import os
import sys

# Project root path set karo
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


async def setup_pakistan_data():
    """
    Main setup function — Pakistan travel data index karo.
    
    Steps:
    1. Database tables create karo (agar nahi hain)
    2. Admin user create karo (ID=1, system user for Pakistan data)
    3. Pakistan data files read karo
    4. RAG service se index karo (chunking + embedding + DB store)
    """
    
    print("=" * 60)
    print("🇵🇰 DISCOVER PAKISTAN — Data Setup")
    print("=" * 60)
    
    # ── Imports ──────────────────────────────────────────────────
    from app.database import create_tables, AsyncSessionLocal
    from app.rag.service import rag_service
    from app.auth.models import User
    from app.auth.service import auth_service
    from sqlalchemy import select
    
    # ── Step 1: Database setup ────────────────────────────────────
    print("\n📦 Step 1: Database tables check kar raha hoon...")
    await create_tables()
    print("   ✅ Database tables ready")
    
    # ── Step 2: System admin user ensure karo ────────────────────
    # Pakistan data ek system user (ID=1) ke naam pe store hogi
    # Jab tourist kuch poochhe to RAG is system user ka data search karegi
    print("\n👤 Step 2: System user check kar raha hoon...")
    
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.id == 1))
        admin_user = result.scalar_one_or_none()
        
        if not admin_user:
            # System admin user banao
            admin_user = User(
                name="Discover Pakistan System",
                email="system@discoverpakistan.pk",
                hashed_password=auth_service.hash_password("system_password_not_for_login"),
            )
            db.add(admin_user)
            await db.commit()
            await db.refresh(admin_user)
            print(f"   ✅ System user created (ID: {admin_user.id})")
        else:
            print(f"   ✅ System user already exists (ID: {admin_user.id})")
        
        system_user_id = admin_user.id
    
    # ── Step 3: Pakistan data files index karo ───────────────────
    print("\n📄 Step 3: Pakistan travel data index kar raha hoon...")
    
    # Data files ka path — script ke saath hi pakistan_data/ folder mein
    data_folder = os.path.join(os.path.dirname(__file__), "pakistan_data")
    
    if not os.path.exists(data_folder):
        print(f"   ❌ Error: {data_folder} folder nahi mila!")
        print("   Pehle 'app/pakistan_data/' folder banao aur destinations.txt daalo")
        return
    
    # Saari .txt files dhundho
    data_files = [f for f in os.listdir(data_folder) if f.endswith('.txt')]
    
    if not data_files:
        print(f"   ❌ Error: {data_folder} mein koi .txt file nahi mili!")
        return
    
    print(f"   📁 {len(data_files)} data file(s) mili:")
    for f in data_files:
        print(f"      - {f}")
    
    total_chunks = 0
    
    async with AsyncSessionLocal() as db:
        for filename in data_files:
            filepath = os.path.join(data_folder, filename)
            
            # File read karo
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                print(f"   ❌ {filename} read karne mein error: {e}")
                continue
            
            if len(content.strip()) < 50:
                print(f"   ⚠️  {filename}: Content bahut chhota hai, skip kar raha hoon")
                continue
            
            print(f"\n   📝 Indexing: {filename} ({len(content):,} characters)...")
            
            try:
                # RAG service se index karo
                # Andar chunking hogi, embeddings banegi, DB mein store hogi
                chunks_created = await rag_service.index_document(
                    content=content,
                    filename=filename,
                    user_id=system_user_id,
                    db=db,
                )
                total_chunks += chunks_created
                print(f"   ✅ {filename}: {chunks_created} chunks indexed")
                
            except Exception as e:
                print(f"   ❌ {filename} indexing mein error: {e}")
                import traceback
                traceback.print_exc()
    
    # ── Step 4: Verification ──────────────────────────────────────
    print(f"\n🔍 Step 4: Verification...")
    
    async with AsyncSessionLocal() as db:
        # Test search karo
        test_query = "Hunza Valley best places to visit"
        print(f"   Test query: '{test_query}'")
        
        results = await rag_service.search_documents(
            query=test_query,
            user_id=system_user_id,
            db=db,
            top_k=2,
        )
        
        if results:
            print(f"   ✅ RAG working! {len(results)} relevant chunks mili:")
            for i, r in enumerate(results, 1):
                print(f"      {i}. Similarity: {r['similarity']} | {r['content'][:100]}...")
        else:
            print("   ⚠️  Test search mein koi result nahi aya — check karo embeddings")
    
    # ── Done ──────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("🎉 SETUP COMPLETE!")
    print("=" * 60)
    print(f"   Total chunks indexed: {total_chunks}")
    print(f"   System user ID: {system_user_id}")
    print(f"\n   Ab chatbot Pakistan travel questions answer kar sakta hai!")
    print(f"   API start karo: uvicorn app.main:app --reload")
    print(f"   Docs: http://localhost:8000/docs")
    print("=" * 60)


# ── Entry Point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # .env file load karo
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("✅ .env file loaded")
    except ImportError:
        print("⚠️  python-dotenv nahi mila — manually environment variables set karo")
    
    # Async function run karo
    asyncio.run(setup_pakistan_data())