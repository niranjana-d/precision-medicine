import os
import chromadb
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="cpic_rag")

BASE_DIR = "rag_data"

for folder in ["cpic", "phenotypes", "mechanisms"]:
    folder_path = os.path.join(BASE_DIR, folder)

    for file in os.listdir(folder_path):
        if file.endswith(".txt"):
            with open(os.path.join(folder_path, file), "r", encoding="utf-8") as f:
                text = f.read()

            embedding = model.encode(text).tolist()

            collection.add(
                documents=[text],
                embeddings=[embedding],
                ids=[f"{folder}_{file}"],
                metadatas=[{"source": folder}]
            )

print("✅ RAG indexing complete")
