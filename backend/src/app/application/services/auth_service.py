"""Application service for authentication."""

from app.application.ports.user_repository import UserRepository
from app.domain.entities.user import User

class AuthApplicationService:
    """Application service for authentication-related use cases."""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def register_anonymous_user(self, user_id: str) -> User:
        """Registers a new anonymous user."""
        user = User(user_id=user_id, is_anonymous=True)
        await self.user_repository.save(user)
        return user
