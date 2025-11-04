"""Domain services for notes."""

class NoteDomainService:
    """Domain service for note-related business logic."""
    def is_note_content_valid(self, content: str) -> bool:
        """Checks if note content is valid."""
        return len(content) > 0
