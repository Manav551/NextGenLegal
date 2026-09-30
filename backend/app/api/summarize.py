from fastapi import APIRouter, HTTPException
from app.models.schemas import SummarizeRequest, AIResponse
from app.core.llm_client import summarize_document
from app.api.documents import document_store

router = APIRouter()

@router.post("/", response_model=AIResponse)
def summarize(request: SummarizeRequest):

    if request.document_id not in document_store:
        raise HTTPException(status_code=404, detail="Document not found. Please upload it first.")

    full_text = document_store[request.document_id]["text"]

    summary = summarize_document(full_text)

    return AIResponse(
        result      = summary,
        document_id = request.document_id,
        model_used  = "llama-3.3-70b-versatile"
    )