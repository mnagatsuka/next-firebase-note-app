"""Application service for notes."""
from typing import List
from app.application.ports.note_repository import NoteRepository
from app.domain.entities.note import Note

class NoteApplicationService:
    """Application service for note-related use cases."""

    def __init__(self, note_repository: NoteRepository):
        self.note_repository = note_repository

    async def create_note(self, user_id: str, title: str, content: str) -> Note:
        """Creates a new note."""
        note = Note(user_id=user_id, title=title, content=content)
        await self.note_repository.save(note)
        return note

    async def get_notes_for_user(self, user_id: str) -> List[Note]:
        """Gets all notes for a user."""
        return await self.note_repository.find_by_user_id(user_id)

    async def get_public_notes(self, limit: int = 20, offset: int = 0) -> List[Note]:
        """Gets public notes."""
        return await self.note_repository.find_public_notes(limit=limit, offset=offset)
