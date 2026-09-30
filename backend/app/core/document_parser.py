import fitz                  # PyMuPDF — for PDF
from docx import Document    # python-docx — for DOCX
from fastapi import HTTPException


def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text from a PDF file page by page."""
    try:
        doc = fitz.open(file_path)
        full_text = []

        for page_num, page in enumerate(doc, start=1):
            text = page.get_text("text")
            if text.strip():
                full_text.append(f"[Page {page_num}]\n{text.strip()}")

        doc.close()

        if not full_text:
            raise HTTPException(
                status_code=422,
                detail="PDF appears to be empty or scanned (no extractable text)."
            )

        return "\n\n".join(full_text)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse PDF: {str(e)}"
        )


def extract_text_from_docx(file_path: str) -> str:
    """Extract all text from a DOCX file paragraph by paragraph."""
    try:
        doc = Document(file_path)
        full_text = []

        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text.strip())

        if not full_text:
            raise HTTPException(
                status_code=422,
                detail="DOCX appears to be empty."
            )

        return "\n\n".join(full_text)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse DOCX: {str(e)}"
        )


def parse_document(file_path: str, extension: str) -> str:
    """
    Main entry point — routes to correct parser based on extension.
    Returns clean extracted text.
    """
    if extension == ".pdf":
        return extract_text_from_pdf(file_path)
    elif extension == ".docx":
        return extract_text_from_docx(file_path)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {extension}"
        )


def get_document_stats(text: str) -> dict:
    """Return basic stats about extracted text — useful for frontend display."""
    words  = text.split()
    lines  = text.splitlines()
    pages  = text.count("[Page ")

    return {
        "word_count":  len(words),
        "line_count":  len(lines),
        "page_count":  pages if pages > 0 else "N/A (DOCX)",
        "char_count":  len(text)
    }