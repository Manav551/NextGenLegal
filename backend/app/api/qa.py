from fastapi import APIRouter, HTTPException
from app.models.schemas import QuestionRequest, AIResponse
from app.core.rag_pipeline import retrieve_relevant_chunks
from app.core.llm_client import answer_question
from app.api.documents import document_store

router = APIRouter()

@router.post("/ask", response_model=AIResponse)
def ask_question(request: QuestionRequest):

    chunks = []

    if request.document_id:
        # Document provided → retrieve relevant chunks via RAG
        if request.document_id not in document_store:
            raise HTTPException(status_code=404, detail="Document not found. Please upload it first.")
        chunks = retrieve_relevant_chunks(request.document_id, request.question, top_k=5)

    # If no document_id → chunks stays empty []
    # answer_question handles both cases via its hybrid prompt
    answer = answer_question(chunks, request.question)

    return AIResponse(
        result      = answer,
        document_id = request.document_id,
        model_used  = "llama-3.3-70b-versatile"
    )