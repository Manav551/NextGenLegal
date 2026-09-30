from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="Legal AI Assistant",
    description="AI-powered legal document analysis platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import documents, qa, summarize, drafting, risk

app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(qa.router,        prefix="/api/qa",        tags=["Q&A"])
app.include_router(summarize.router, prefix="/api/summarize", tags=["Summarize"])
app.include_router(drafting.router,  prefix="/api/drafting",  tags=["Drafting"])
app.include_router(risk.router,      prefix="/api/risk",      tags=["Risk"])

@app.get("/")
def root():
    return {"status": "Legal AI Assistant backend is running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model": os.getenv("MODEL_NAME"),
        "debug": os.getenv("DEBUG")
    }

@app.get("/test-llm")
def test_llm():
    from app.core.llm_client import call_llm
    result = call_llm(
        system_prompt = "You are a helpful legal assistant.",
        user_prompt   = "In one sentence, what is an NDA?"
    )
    return {"response": result}