from fastapi import APIRouter
from app.models.schemas import DraftRequest, AIResponse
from app.core.llm_client import draft_document

router = APIRouter()

@router.post("/", response_model=AIResponse)
def draft(request: DraftRequest):

    result = draft_document(
        document_type = request.document_type,
        instructions  = request.instructions,
        jurisdiction  = request.jurisdiction or "General"
    )

    return AIResponse(
        result     = result,
        model_used = "llama-3.3-70b-versatile"
    )