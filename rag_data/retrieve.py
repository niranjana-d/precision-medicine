
import chromadb
from sentence_transformers import SentenceTransformer

# Initialize persistent client
client = chromadb.PersistentClient(path="./chroma_db")
model = SentenceTransformer("all-MiniLM-L6-v2")

def retrieve_context(gene: str, drug: str, phenotype: str) -> str:
    """
    Retrieves relevant context from the vector database based on gene, drug, and phenotype.
    """
    collection = client.get_collection(name="cpic_rag")
    
    query_text = f"Gene: {gene}, Drug: {drug}, Phenotype: {phenotype}"
    query_embedding = model.encode(query_text).tolist()
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )
    
    context = ""
    if results['documents']:
        for i, doc in enumerate(results['documents'][0]):
             # Basic deduplication or formatting could go here
             context += f"{doc}\n\n"
             
    return context.strip()
