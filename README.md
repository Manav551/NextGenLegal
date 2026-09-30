# Legal AI Assistant

Monorepo for a Legal AI Assistant with:
- `backend`: FastAPI server for document management, Q&A, summarization, drafting, and risk analysis.
- `frontend`: React + Vite client application.

## Quick Start

### Backend
1. Create and activate a virtual environment.
2. Install dependencies:
   - `pip install -r backend/requirements.txt`
3. Run API:
   - `uvicorn app.main:app --reload --app-dir backend`

### Frontend
1. Install dependencies:
   - `cd frontend && npm install`
2. Start dev server:
   - `npm run dev`

Backend default URL: `http://localhost:8000`
Frontend default URL: `http://localhost:5173`
