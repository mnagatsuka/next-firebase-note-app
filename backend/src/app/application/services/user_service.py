"""Application service for users."""
from app.application.ports.user_repository import UserRepository
from app.domain.entities.user import User

class UserApplicationService:
    """Application service for user-related use cases."""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def get_user_profile(self, user_id: str) -> User | None:
        """Gets a user profile."""
        return await self.user_repository.find_by_id(user_id)
