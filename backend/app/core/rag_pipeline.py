import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from app.config import settings

# Load embedding model once at startup (runs locally, no API needed)
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# In-memory store: document_id → { chunks, faiss_index }
rag_store: dict = {}


# ── 1. CHUNKING ──────────────────────────────────────────────────────────────

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping chunks.
    overlap ensures context isn't lost at chunk boundaries.
    """
    words  = text.split()
    chunks = []
    start  = 0

    while start < len(words):
        end   = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap  # step back by overlap for continuity

    return chunks


# ── 2. EMBEDDING + INDEXING ───────────────────────────────────────────────────

def build_vector_index(document_id: str, text: str):
    """
    Chunk the document text, embed each chunk,
    and store in a FAISS index keyed by document_id.
    """
    chunks     = chunk_text(text)
    embeddings = embedder.encode(chunks, show_progress_bar=False)
    embeddings = np.array(embeddings).astype("float32")

    # FAISS flat index — exact nearest-neighbour search
    dimension = embeddings.shape[1]
    index     = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    # Save to memory
    rag_store[document_id] = {
        "chunks": chunks,
        "index":  index
    }

    return len(chunks)


# ── 3. RETRIEVAL ─────────────────────────────────────────────────────────────

def retrieve_relevant_chunks(document_id: str, query: str, top_k: int = 5) -> list[str]:
    """
    Embed the user's query and find the top_k most similar chunks
    from the document's FAISS index.
    """
    if document_id not in rag_store:
        raise ValueError(f"No index found for document_id: {document_id}")

    query_vec = embedder.encode([query])
    query_vec = np.array(query_vec).astype("float32")

    index  = rag_store[document_id]["index"]
    chunks = rag_store[document_id]["chunks"]

    # Search — returns distances and indices of top_k matches
    _, indices = index.search(query_vec, top_k)

    results = [chunks[i] for i in indices[0] if i < len(chunks)]
    return results


# ── 4. CLEANUP ────────────────────────────────────────────────────────────────

def remove_index(document_id: str):
    """Remove a document's index from memory when it's deleted."""
    if document_id in rag_store:
        del rag_store[document_id]