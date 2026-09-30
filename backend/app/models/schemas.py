from pydantic import BaseModel
from typing import Optional


class DocumentUploadResponse(BaseModel):
    message:       str
    document_id:   str
    original_name: str
    size_mb:       float
    word_count:    int
    page_count:    str | int


class QuestionRequest(BaseModel):
    document_id: Optional[str] = None   
    question:    str


class SummarizeRequest(BaseModel):
    document_id: str


class DraftRequest(BaseModel):
    document_type: str          # e.g. "NDA", "Employment Contract"
    instructions:  str          # user's custom instructions
    jurisdiction:  Optional[str] = "General"


class RiskAnalysisRequest(BaseModel):
    document_id: str


class AIResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    result:      str
    document_id: Optional[str] = None
    model_used:  Optional[str] = None