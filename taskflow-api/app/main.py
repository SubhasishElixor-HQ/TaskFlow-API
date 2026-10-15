from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="A task management API built with security and maintainability in mind.",
    version="0.1.0",
    debug=settings.debug,
)

# Configure explicit origins in .env for any browser frontend.
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    )

app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"service": "taskflow-api", "status": "ok"}
