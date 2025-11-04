"""Abstract repository for notes."""
from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.entities.note import Note

class NoteRepository(ABC):
    """Port for note repository."""

    @abstractmethod
    async def save(self, note: Note) -> None:
        """Saves a note."""
        pass

    @abstractmethod
    async def find_by_id(self, note_id: str) -> Optional[Note]:
        """Finds a note by its ID."""
        pass

    @abstractmethod
    async def find_by_user_id(self, user_id: str) -> List[Note]:
        """Finds all notes for a given user."""
        pass

    @abstractmethod
    async def find_public_notes(self, limit: int, offset: int) -> List[Note]:
        """Finds public notes."""
        pass

    @abstractmethod
    async def delete(self, note_id: str) -> None:
        """Deletes a note."""
        pass
