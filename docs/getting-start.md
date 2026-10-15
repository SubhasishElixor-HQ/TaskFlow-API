# Getting Started

## Prerequisites
Install Git, Node.js, Python, uv, and Docker Desktop if using containerized PostgreSQL.

## Setup
1. Locate the project root and its configuration files.
2. Start PostgreSQL using the existing Docker Compose configuration.
3. Configure backend environment variables using `.env.example`.
4. Install backend dependencies with `uv sync`.
5. Start FastAPI with `uv run uvicorn app.main:app --host 127.0.0.1 --port 8000`.
6. Install frontend dependencies with `npm install` in the frontend directory.
7. Start Next.js with `npm run dev`.

## Local URLs
- Frontend: http://localhost:3000
- API docs: http://127.0.0.1:8000/docs

## Troubleshooting
- Compose file not found: change to the directory containing the Compose file.
- API unavailable: check the backend terminal and port 8000.
- Registration hangs: inspect browser Network/Console and backend logs.
- Database errors: check container status, connection settings, and migrations.