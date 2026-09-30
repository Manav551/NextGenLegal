from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.file_handler import save_upload_file, delete_file
from app.core.document_parser import parse_document, get_document_stats
from app.core.rag_pipeline import build_vector_index, remove_index
from app.models.schemas import DocumentUploadResponse

router = APIRouter()

document_store: dict = {}


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):

    # 1. Save file to disk
    file_meta = await save_upload_file(file)

    # 2. Parse and extract text
    text = parse_document(file_meta["file_path"], file_meta["extension"])

    # 3. Get stats
    stats = get_document_stats(text)

    # 4. Store text in memory
    doc_id = file_meta["saved_name"].split(".")[0]
    document_store[doc_id] = {
        "text":          text,
        "file_path":     file_meta["file_path"],
        "original_name": file_meta["original_name"],
        "extension":     file_meta["extension"],
    }

    # 5. ✅ NEW — Build RAG index for this document
    chunk_count = build_vector_index(doc_id, text)

    return DocumentUploadResponse(
        message       = f"Document uploaded, parsed & indexed ({chunk_count} chunks).",
        document_id   = doc_id,
        original_name = file_meta["original_name"],
        size_mb       = file_meta["size_mb"],
        word_count    = stats["word_count"],
        page_count    = stats["page_count"]
    )


@router.delete("/{document_id}")
def delete_document(document_id: str):
    if document_id not in document_store:
        raise HTTPException(status_code=404, detail="Document not found.")

    delete_file(document_store[document_id]["file_path"])
    remove_index(document_id)          # ✅ NEW — clean up RAG index too
    del document_store[document_id]

    return {"message": "Document deleted successfully."}


@router.get("/list")
def list_documents():
    return {
        doc_id: {
            "original_name": meta["original_name"],
            "extension":     meta["extension"]
        }
        for doc_id, meta in document_store.items()
    }