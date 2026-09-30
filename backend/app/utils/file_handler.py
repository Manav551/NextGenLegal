import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from app.config import settings

ALLOWED_EXTENSIONS = {".pdf", ".docx"}

async def save_upload_file(file: UploadFile) -> dict:
    """Save uploaded file to disk, return metadata."""

    # Validate extension
    ext = os.path.splitext(file.filename)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not supported. Upload PDF or DOCX only."
        )

    # Validate file size
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size_mb:.1f}MB). Max allowed: {settings.MAX_FILE_SIZE_MB}MB."
        )

    # Generate unique filename to avoid conflicts
    unique_name = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(settings.UPLOAD_DIR, unique_name)

    # Ensure uploads folder exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Write file to disk
    async with aiofiles.open(save_path, "wb") as f:
        await f.write(contents)

    return {
        "original_name": file.filename,
        "saved_name":    unique_name,
        "file_path":     save_path,
        "extension":     ext,
        "size_mb":       round(size_mb, 2)
    }


def delete_file(file_path: str):
    """Delete a file from disk safely."""
    if os.path.exists(file_path):
        os.remove(file_path)