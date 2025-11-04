"""DynamoDB repository for notes.

Implements persistence using a DynamoDB table. This version prefers
scan-based fallbacks for simplicity in local development. If GSIs are
available, it can be extended to use efficient queries.
"""
from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import List, Optional

import boto3
from boto3.dynamodb.conditions import Attr, Key

from app.application.ports.note_repository import NoteRepository
from app.domain.entities.note import Note, NotePrivacy


logger = logging.getLogger(__name__)


class DynamoDBNoteRepository(NoteRepository):
    """DynamoDB implementation of the note repository."""

    def __init__(self) -> None:
        endpoint_url = os.getenv("APP_AWS_ENDPOINT_URL")
        region_name = os.getenv("APP_AWS_REGION", "us-east-1")
        self._table_name = os.getenv("APP_DYNAMODB_TABLE_NOTES")
        if not self._table_name:
            logger.warning(
                "APP_DYNAMODB_TABLE_NOTES is not set; repository will return empty results."
            )

        session = boto3.session.Session(
            aws_access_key_id=os.getenv("APP_AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("APP_AWS_SECRET_ACCESS_KEY"),
            region_name=region_name,
        )
        self._ddb = session.resource("dynamodb", endpoint_url=endpoint_url)
        self._table = (
            self._ddb.Table(self._table_name) if self._table_name else None
        )

        # Optional index names (if configured in your table)
        self._gsi_public = os.getenv("APP_DYNAMODB_GSI_PUBLIC")  # e.g., privacy-updated_at
        self._gsi_user = os.getenv("APP_DYNAMODB_GSI_USER")  # e.g., user_id-updated_at

    # ------------------------
    # Model mapping helpers
    # ------------------------
    @staticmethod
    def _to_item(note: Note) -> dict:
        return {
            "id": note.id,
            "user_id": note.user_id,
            "title": note.title,
            "content": note.content,
            "privacy": note.privacy.value,
            # Store as ISO 8601 strings
            "created_at": note.created_at.astimezone(timezone.utc).isoformat(),
            "updated_at": note.updated_at.astimezone(timezone.utc).isoformat(),
        }

    @staticmethod
    def _parse_dt(value: Optional[str]) -> datetime:
        if not value:
            return datetime.now(timezone.utc)
        try:
            dt = datetime.fromisoformat(value)
            # Ensure timezone-aware (some serializers may drop tzinfo)
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except Exception:
            return datetime.now(timezone.utc)

    @classmethod
    def _from_item(cls, item: dict) -> Note:
        return Note(
            id=item.get("id"),
            user_id=item.get("user_id", ""),
            title=item.get("title", ""),
            content=item.get("content", ""),
            privacy=NotePrivacy(item.get("privacy", NotePrivacy.PRIVATE.value)),
            created_at=cls._parse_dt(item.get("created_at")),
            updated_at=cls._parse_dt(item.get("updated_at")),
        )

    # ------------------------
    # CRUD operations
    # ------------------------
    async def save(self, note: Note) -> None:
        logger.debug("Saving note to DynamoDB", extra={"note_id": note.id})
        if not self._table:
            logger.error("No DynamoDB table configured (APP_DYNAMODB_TABLE_NOTES).")
            return None
        # Ensure updated_at is current on save
        note.updated_at = datetime.now(timezone.utc)
        self._table.put_item(Item=self._to_item(note))
        return None

    async def find_by_id(self, note_id: str) -> Optional[Note]:
        logger.debug("Finding note in DynamoDB", extra={"note_id": note_id})
        if not self._table:
            return None
        resp = self._table.get_item(Key={"id": note_id})
        item = resp.get("Item")
        return self._from_item(item) if item else None

    async def find_by_user_id(self, user_id: str) -> List[Note]:
        logger.debug("Finding notes for user in DynamoDB", extra={"user_id": user_id})
        if not self._table:
            return []

        try:
            # Prefer GSI if available
            if self._gsi_user:
                resp = self._table.query(
                    IndexName=self._gsi_user,
                    KeyConditionExpression=Key("user_id").eq(user_id),
                    ScanIndexForward=False,  # newest first if SK is time-based
                )
                items = resp.get("Items", [])
            else:
                # Fallback to scan + filter when no index is configured
                resp = self._table.scan(
                    FilterExpression=Attr("user_id").eq(user_id)
                )
                items = resp.get("Items", [])
                # Best-effort sort by updated_at desc
                items.sort(
                    key=lambda x: x.get("updated_at", ""), reverse=True
                )
        except Exception:
            logger.exception("DynamoDB error while fetching notes by user_id")
            return []

        return [self._from_item(it) for it in items]

    async def find_public_notes(self, limit: int, offset: int) -> List[Note]:
        logger.debug(
            "Finding public notes in DynamoDB", extra={"limit": limit, "offset": offset}
        )
        if not self._table:
            return []

        try:
            items: List[dict]
            # Prefer GSI if available
            if self._gsi_public:
                resp = self._table.query(
                    IndexName=self._gsi_public,
                    KeyConditionExpression=Key("privacy").eq(NotePrivacy.PUBLIC.value),
                    ScanIndexForward=False,  # newest first if SK is time-based
                    Limit=limit + offset,  # fetch enough to slice after offset
                )
                items = resp.get("Items", [])
            else:
                # Fallback to scan and filter for local dev
                resp = self._table.scan(
                    FilterExpression=Attr("privacy").eq(NotePrivacy.PUBLIC.value)
                )
                items = resp.get("Items", [])
                # Sort by updated_at desc if present
                items.sort(
                    key=lambda x: x.get("updated_at", ""), reverse=True
                )

            # Apply offset/limit window
            window = items[offset : offset + limit]
        except Exception:
            logger.exception("DynamoDB error while fetching public notes")
            return []

        return [self._from_item(it) for it in window]

    async def delete(self, note_id: str) -> None:
        logger.debug("Deleting note from DynamoDB", extra={"note_id": note_id})
        if not self._table:
            return None
        try:
            self._table.delete_item(Key={"id": note_id})
        except Exception:
            logger.exception("DynamoDB error while deleting note")
        return None
