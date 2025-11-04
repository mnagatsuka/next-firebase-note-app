# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from generated_fastapi_server.apis.personal_notebook_api_base import BasePersonalNotebookApi
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
from typing import Any, Optional
from typing_extensions import Annotated
from generated_fastapi_server.models.create_note_request import CreateNoteRequest
from generated_fastapi_server.models.error_response import ErrorResponse
from generated_fastapi_server.models.private_note_list_response import PrivateNoteListResponse
from generated_fastapi_server.models.private_note_response import PrivateNoteResponse
from generated_fastapi_server.models.update_note_request import UpdateNoteRequest
from generated_fastapi_server.security_api import get_token_SessionAuth, get_token_BearerAuth

router = APIRouter()

ns_pkg = generated_fastapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/me/notes",
    responses={
        201: {"model": PrivateNoteResponse, "description": "Note created successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request data"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
    },
    tags=["Personal Notebook"],
    summary="Create new private note",
    response_model_by_alias=True,
)
async def create_user_note(
    body: CreateNoteRequest = Body(None, description=""),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PrivateNoteResponse:
    """Create a new private plain text note. If user is anonymous and not yet registered in database, they will be automatically registered. """
    if not BasePersonalNotebookApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePersonalNotebookApi.subclasses[0]().create_user_note(body)


@router.delete(
    "/me/notes/{id}",
    responses={
        204: {"description": "Note deleted successfully"},
        404: {"model": ErrorResponse, "description": "Note not found"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
    },
    tags=["Personal Notebook"],
    summary="Delete private note",
    response_model_by_alias=True,
)
async def delete_user_note(
    id: Annotated[StrictStr, Field(description="The ID of the note")] = Path(..., description="The ID of the note"),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> None:
    """Delete a private note from user&#39;s notebook"""
    if not BasePersonalNotebookApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePersonalNotebookApi.subclasses[0]().delete_user_note(id)


@router.get(
    "/me/notes/{id}",
    responses={
        200: {"model": PrivateNoteResponse, "description": "Private note details"},
        404: {"model": ErrorResponse, "description": "Note not found"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
    },
    tags=["Personal Notebook"],
    summary="Get user&#39;s private note",
    response_model_by_alias=True,
)
async def get_user_note(
    id: Annotated[StrictStr, Field(description="The ID of the note")] = Path(..., description="The ID of the note"),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PrivateNoteResponse:
    """Retrieve a specific private note by ID"""
    if not BasePersonalNotebookApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePersonalNotebookApi.subclasses[0]().get_user_note(id)


@router.get(
    "/me/notes",
    responses={
        200: {"model": PrivateNoteListResponse, "description": "List of user&#39;s private notes"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
    },
    tags=["Personal Notebook"],
    summary="List user&#39;s private notes",
    response_model_by_alias=True,
)
async def get_user_notes(
    page: Annotated[Optional[Annotated[int, Field(strict=True, ge=1)]], Field(description="Page number (1-based)")] = Query(1, description="Page number (1-based)", alias="page", ge=1),
    limit: Annotated[Optional[Annotated[int, Field(le=100, strict=True, ge=1)]], Field(description="Number of notes per page")] = Query(20, description="Number of notes per page", alias="limit", ge=1, le=100),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PrivateNoteListResponse:
    """Get user&#39;s private plain text notes in their personal notebook. If user is not authenticated, this will automatically create an anonymous user and register them in the database. """
    if not BasePersonalNotebookApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePersonalNotebookApi.subclasses[0]().get_user_notes(page, limit)


@router.patch(
    "/me/notes/{id}",
    responses={
        200: {"model": PrivateNoteResponse, "description": "Note updated successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request data"},
        404: {"model": ErrorResponse, "description": "Note not found"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
    },
    tags=["Personal Notebook"],
    summary="Update private note",
    response_model_by_alias=True,
)
async def update_user_note(
    id: Annotated[StrictStr, Field(description="The ID of the note")] = Path(..., description="The ID of the note"),
    body: UpdateNoteRequest = Body(None, description=""),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> PrivateNoteResponse:
    """Update an existing private note"""
    if not BasePersonalNotebookApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BasePersonalNotebookApi.subclasses[0]().update_user_note(id, body)
