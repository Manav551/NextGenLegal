from groq import Groq
from app.config import settings

# Initialize Groq client once at startup
client = Groq(api_key=settings.GROQ_API_KEY)


# ── CORE FUNCTION ─────────────────────────────────────────────────────────────

def call_llm(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
    """
    Send a prompt to Llama 3.3 via Groq and return the response text.
    
    temperature: 0.1 = focused/deterministic, 0.7 = more creative
    We default to 0.3 — factual but not robotic, good for legal work.
    """
    try:
        response = client.chat.completions.create(
            model    = settings.MODEL_NAME,
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt}
            ],
            temperature = temperature,
            max_tokens  = 2048
        )
        return response.choices[0].message.content

    except Exception as e:
        raise RuntimeError(f"LLM call failed: {str(e)}")


# ── FEATURE-SPECIFIC CALLERS ──────────────────────────────────────────────────

def answer_question(context_chunks: list[str], question: str) -> str:
    """
    Hybrid Q&A:
    - If answer is in the document → answer from document (cited)
    - If not in document → answer from general legal knowledge
    - If neither → say so honestly
    """
    context = "\n\n---\n\n".join(context_chunks)

    system = """You are an expert legal assistant with deep knowledge of law, contracts, and legal concepts.

You have two sources of knowledge:
1. The specific document context provided by the user
2. Your broad general legal knowledge and expertise

Follow this priority logic:
- If the question can be answered from the document context → answer it and mention it's based on the document
- If the question is NOT in the document but is a general legal question → answer it from your legal expertise and clearly say: "This isn't covered in your document, but generally in law..."
- If the question is completely outside legal domain → politely say it's outside your scope

Always be concise, professional, and genuinely helpful."""

    user = f"""DOCUMENT CONTEXT:
{context}

USER QUESTION:
{question}"""

    return call_llm(system, user, temperature=0.2)


def summarize_document(full_text: str) -> str:
    """
    Summarization — produce a structured legal summary of the full document.
    """
    system = """You are a senior legal analyst. 
Summarize the provided legal document in a clear, structured format.
Your summary must include:
1. Document Type & Purpose
2. Key Parties Involved
3. Core Terms & Obligations
4. Important Dates or Deadlines
5. Notable Clauses or Conditions
6. Overall Assessment (1-2 sentences)
Be professional and concise."""

    user = f"""Please summarize the following legal document:

{full_text[:6000]}"""   # cap at 6000 words to stay within token limits

    return call_llm(system, user, temperature=0.2)


def draft_document(document_type: str, instructions: str, jurisdiction: str) -> str:
    """
    Legal Drafting — generate a new legal document from scratch.
    Higher temperature for more creative/varied drafts.
    """
    system = """You are an expert legal drafter with 20 years of experience.
Draft professional, legally sound documents with proper structure and formatting.
Always include: title, parties section, recitals, definitions, core clauses, 
signature blocks, and jurisdiction clause.
Add [PLACEHOLDER] tags where specific details need to be filled in."""

    user = f"""Draft a {document_type} with the following requirements:

INSTRUCTIONS: {instructions}
JURISDICTION: {jurisdiction}

Produce a complete, professionally formatted legal document."""

    return call_llm(system, user, temperature=0.4)


def analyze_risks(context_chunks: list[str], full_text: str) -> str:
    """
    Risk Analysis — scan document for risky, unusual, or concerning clauses.
    RAG grounded: retrieves most relevant chunks for targeted analysis.
    """
    context = "\n\n---\n\n".join(context_chunks)

    system = """You are a legal risk analyst specializing in contract review.
Analyze the document for potentially risky, unfair, or concerning clauses.
Format your response EXACTLY as follows for each issue found:

🔴 HIGH RISK: [clause or phrase]
   → Why it's risky: [explanation]
   → Recommendation: [what to do]

🟡 MEDIUM RISK: [clause or phrase]
   → Why it's risky: [explanation]
   → Recommendation: [what to do]

🟢 NOTE: [clause or phrase]
   → Why it's notable: [explanation]
   → Recommendation: [what to do]

End with an OVERALL RISK SCORE: [Low / Medium / High] and a one-line summary."""

    user = f"""Analyze the following legal document for risks and concerning clauses:

{context}"""

    return call_llm(system, user, temperature=0.1)