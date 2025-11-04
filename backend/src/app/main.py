"""Main FastAPI application."""
import app.shared.generated_imports  # ensure generated package on sys.path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.shared.logging import configure_logging
from app.shared.config import settings

app = FastAPI(
    title="Simple Note Application API",
    version="1.0.0",
)

# Configure logging early
configure_logging()

# Add CORS middleware (development only - production uses AWS Lambda Function URL CORS)
if settings.env == "development":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router)

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
