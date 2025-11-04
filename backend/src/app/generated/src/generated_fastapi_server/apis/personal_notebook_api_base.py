# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from pydantic import Field, StrictStr
from typing import Any, Optional
from typing_extensions import Annotated
from generated_fastapi_server.models.create_note_request import CreateNoteRequest
from generated_fastapi_server.models.error_response import ErrorResponse
from generated_fastapi_server.models.private_note_list_response import PrivateNoteListResponse
from generated_fastapi_server.models.private_note_response import PrivateNoteResponse
from generated_fastapi_server.models.update_note_request import UpdateNoteRequest
from generated_fastapi_server.security_api import get_token_SessionAuth, get_token_BearerAuth

class BasePersonalNotebookApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BasePersonalNotebookApi.subclasses = BasePersonalNotebookApi.subclasses + (cls,)
    async def create_user_note(
        self,
        body: CreateNoteRequest,
    ) -> PrivateNoteResponse:
        """Create a new private plain text note. If user is anonymous and not yet registered in database, they will be automatically registered. """
        ...


    async def delete_user_note(
        self,
        id: Annotated[StrictStr, Field(description="The ID of the note")],
    ) -> None:
        """Delete a private note from user&#39;s notebook"""
        ...


    async def get_user_note(
        self,
        id: Annotated[StrictStr, Field(description="The ID of the note")],
    ) -> PrivateNoteResponse:
        """Retrieve a specific private note by ID"""
        ...


    async def get_user_notes(
        self,
        page: Annotated[Optional[Annotated[int, Field(strict=True, ge=1)]], Field(description="Page number (1-based)")],
        limit: Annotated[Optional[Annotated[int, Field(le=100, strict=True, ge=1)]], Field(description="Number of notes per page")],
    ) -> PrivateNoteListResponse:
        """Get user&#39;s private plain text notes in their personal notebook. If user is not authenticated, this will automatically create an anonymous user and register them in the database. """
        ...


    async def update_user_note(
        self,
        id: Annotated[StrictStr, Field(description="The ID of the note")],
        body: UpdateNoteRequest,
    ) -> PrivateNoteResponse:
        """Update an existing private note"""
        ...
