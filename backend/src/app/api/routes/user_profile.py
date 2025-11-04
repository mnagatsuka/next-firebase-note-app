"""API routes for user profile."""
from fastapi import APIRouter, Depends
from app.shared.dependencies import get_regular_user

router = APIRouter(prefix="/me", tags=["User Profile"])

@router.get("")
async def get_my_profile(current_user: dict = Depends(get_regular_user)):
    user_id = current_user.get("uid")
    return {"message": f"Profile for user {user_id}"}
