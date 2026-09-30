from fastapi import APIRouter, HTTPException
from app.models.schemas import RiskAnalysisRequest, AIResponse
from app.core.rag_pipeline import retrieve_relevant_chunks
from app.core.llm_client import analyze_risks
from app.api.documents import document_store

router = APIRouter()

@router.post("/analyze", response_model=AIResponse)
def risk_analysis(request: RiskAnalysisRequest):

    if request.document_id not in document_store:
        raise HTTPException(status_code=404, detail="Document not found. Please upload it first.")

    full_text = document_store[request.document_id]["text"]

    # Retrieve chunks most relevant to risky legal language
    chunks = retrieve_relevant_chunks(
        request.document_id,
        query  = "obligations penalties termination liability indemnification confidentiality",
        top_k  = 8
    )

    result = analyze_risks(chunks, full_text)

    return AIResponse(
        result      = result,
        document_id = request.document_id,
        model_used  = "llama-3.3-70b-versatile"
    )