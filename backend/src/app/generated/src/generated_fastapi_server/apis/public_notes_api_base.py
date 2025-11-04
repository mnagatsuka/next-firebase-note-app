# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing import Optional
from typing_extensions import Annotated
from generated_fastapi_server.models.error_response import ErrorResponse
from generated_fastapi_server.models.note_list_response import NoteListResponse
from generated_fastapi_server.models.note_response import NoteResponse
from generated_fastapi_server.security_api import get_token_SessionAuth, get_token_BearerAuth

class BasePublicNotesApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BasePublicNotesApi.subclasses = BasePublicNotesApi.subclasses + (cls,)
    async def get_public_note(
        self,
        id: Annotated[StrictStr, Field(description="The UUID of the note")],
    ) -> NoteResponse:
        """Retrieve a specific public note by its UUID"""
        ...


    async def list_public_notes(
        self,
        page: Annotated[Optional[Annotated[int, Field(strict=True, ge=1)]], Field(description="Page number (1-based)")],
        limit: Annotated[Optional[Annotated[int, Field(le=100, strict=True, ge=1)]], Field(description="Number of notes per page")],
    ) -> NoteListResponse:
        """Get a paginated list of latest public notes in chronological order"""
        ...
