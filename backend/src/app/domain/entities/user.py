"""Domain entities for users."""
from dataclasses import dataclass, field
from datetime import datetime, timezone

@dataclass
class User:
    """User domain entity."""
    user_id: str
    display_name: str | None = None
    email: str | None = None
    is_anonymous: bool = True
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
