"""Main API router."""
from fastapi import APIRouter
from app.api.routes import authentication, personal_notebook, public_notes, user_profile

api_router = APIRouter()

# Order matters here if prefixes are the same, but paths are distinct.
# GET /me is handled by user_profile.router
# GET /me/notes is handled by personal_notebook.router
# FastAPI is smart enough to handle this routing correctly.
api_router.include_router(authentication.router)
api_router.include_router(public_notes.router)
api_router.include_router(user_profile.router) # Handles /me
api_router.include_router(personal_notebook.router) # Handles /me/notes

