"""Domain entities for notes."""
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
import uuid


class NotePrivacy(Enum):
    PUBLIC = "public"
    PRIVATE = "private"


@dataclass
class Note:
    """Note domain entity."""
    # Required fields (no defaults) must come first for dataclasses
    user_id: str
    title: str
    content: str

    # Optional / defaulted fields follow
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    privacy: NotePrivacy = NotePrivacy.PRIVATE
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
