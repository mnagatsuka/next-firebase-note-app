# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from generated_fastapi_server.apis.public_notes_api_base import BasePublicNotesApi
import generated_fastapi_server.impl

from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Response,
    Security,
    status,
)

from generated_fastapi_server.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field, StrictStr
from typing import Optional
from typing_extensions import Annotated
from generated_fastapi_server.models.error_response import ErrorResponse
from generated_fastapi_server.models.note_list_response import NoteListResponse
from generated_fastapi_server.models.note_response import NoteResponse
from generated_fastapi_server.security_api import get_token_SessionAuth, get_token_BearerAuth

router = APIRouter()

ns_pkg = generated_fastapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.get(
    "/notes/{id}",
    responses={
        200: {"model": NoteResponse, "description": "Public note details"},
        404: {"model": ErrorResponse, "description": "Note not found"},
    },
    tags=["Public Notes"],
    summary="Get public note by ID",
    response_model_by_alias=True,
)
async def get_public_note(
    id: Annotated[StrictStr, Field(description="The UUID of the note")] = Path(..., description="The UUID of the note"),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> NoteResponse:
    """Retrieve a specific public note by its UUID"""
    if not BasePublicNotesApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePublicNotesApi.subclasses[0]().get_public_note(id)


@router.get(
    "/notes",
    responses={
        200: {"model": NoteListResponse, "description": "List of public notes"},
        400: {"model": ErrorResponse, "description": "Invalid query parameters"},
    },
    tags=["Public Notes"],
    summary="List latest public notes",
    response_model_by_alias=True,
)
async def list_public_notes(
    page: Annotated[Optional[Annotated[int, Field(strict=True, ge=1)]], Field(description="Page number (1-based)")] = Query(1, description="Page number (1-based)", alias="page", ge=1),
    limit: Annotated[Optional[Annotated[int, Field(le=100, strict=True, ge=1)]], Field(description="Number of notes per page")] = Query(20, description="Number of notes per page", alias="limit", ge=1, le=100),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> NoteListResponse:
    """Get a paginated list of latest public notes in chronological order"""
    if not BasePublicNotesApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePublicNotesApi.subclasses[0]().list_public_notes(page, limit)
