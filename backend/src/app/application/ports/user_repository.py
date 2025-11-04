"""Abstract repository for users."""
from abc import ABC, abstractmethod
from typing import Optional
from app.domain.entities.user import User

class UserRepository(ABC):
    """Port for user repository."""

    @abstractmethod
    async def save(self, user: User) -> None:
        """Saves a user."""
        pass

    @abstractmethod
    async def find_by_id(self, user_id: str) -> Optional[User]:
        """Finds a user by their ID."""
        pass
