import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
})

// ── Documents ─────────────────────────────────────────
export const uploadDocument = (file) => {
  const form = new FormData()
  form.append('file', file)
  return API.post('/api/documents/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteDocument = (documentId) =>
  API.delete(`/api/documents/${documentId}`)

// ── Q&A ───────────────────────────────────────────────
export const askQuestion = (question, documentId = null) =>
  API.post('/api/qa/ask', {
    question,
    ...(documentId && { document_id: documentId }),
  })

// ── Summarize ─────────────────────────────────────────
export const summarizeDocument = (documentId) =>
  API.post('/api/summarize/', { document_id: documentId })

// ── Drafting ──────────────────────────────────────────
export const draftDocument = (documentType, instructions, jurisdiction) =>
  API.post('/api/drafting/', { document_type: documentType, instructions, jurisdiction })

// ── Risk Analysis ─────────────────────────────────────
export const analyzeRisk = (documentId) =>
  API.post('/api/risk/analyze', { document_id: documentId })