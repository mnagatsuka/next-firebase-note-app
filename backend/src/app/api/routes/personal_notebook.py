"""API routes for personal notebook."""
from fastapi import APIRouter, Depends
from app.shared.dependencies import get_current_user

router = APIRouter(prefix="/me", tags=["Personal Notebook"])

@router.get("/notes")
async def get_my_notes(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("uid")
    return {"message": f"Notes for user {user_id}"}
