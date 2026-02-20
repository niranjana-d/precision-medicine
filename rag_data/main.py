from fastapi import FastAPI
from rag_data.retrieve import retrieve_context
app = FastAPI()

@app.post("/explain")
def explain(payload: dict):
    gene = payload["gene"]
    drug = payload["drug"]
    phenotype = payload["phenotype"]
    depth = payload.get("depth", "summary")

    context = retrieve_context(gene, drug, phenotype)

    return {
        "retrieved_context": context,
        "depth": depth
    }