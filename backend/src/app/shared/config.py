"""Application configuration utilities.

Minimal settings loader without extra dependencies to keep runtime light.
"""
from __future__ import annotations

from dataclasses import dataclass
import json
import os


@dataclass(frozen=True)
class Settings:
    """Strongly-typed application settings.

    Extend as needed; defaults are development-friendly.
    """

    # Runtime
    env: str = "development"
    log_level: str = "INFO"
    
    # CORS (following reference repository pattern)
    allowed_origins: list[str] = None

    # AWS / DynamoDB (placeholders for future implementation)
    aws_region: str = "us-east-1"
    dynamodb_table_prefix: str = "notes_"

    # Firebase
    firebase_project_id: str = ""

    @staticmethod
    def from_env() -> "Settings":
        # Parse CORS origins from environment (following reference repository pattern)
        allowed_origins_str = os.getenv("APP_ALLOWED_ORIGINS", '["http://localhost:3000"]')
        try:
            allowed_origins = json.loads(allowed_origins_str)
        except (json.JSONDecodeError, TypeError):
            allowed_origins = ["http://localhost:3000"]
            
        return Settings(
            env=os.getenv("APP_ENV", os.getenv("ENV", "development")),
            log_level=os.getenv("LOG_LEVEL", "INFO"),
            allowed_origins=allowed_origins,
            aws_region=os.getenv("AWS_REGION", "us-east-1"),
            dynamodb_table_prefix=os.getenv("DYNAMODB_TABLE_PREFIX", "notes_"),
            firebase_project_id=os.getenv("FIREBASE_PROJECT_ID", ""),
        )


# Singleton-style settings object
settings: Settings = Settings.from_env()

