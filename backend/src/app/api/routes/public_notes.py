"""API routes for public notes."""
from fastapi import APIRouter, Depends, Query

# Ensure generated package is importable
import app.shared.generated_imports  # noqa: F401

# Import generated models
from generated_fastapi_server.models.note_list_response import NoteListResponse
from generated_fastapi_server.models.public_note import PublicNote
from generated_fastapi_server.models.pagination import Pagination
from generated_fastapi_server.models.note_list_response_data import NoteListResponseData
from generated_fastapi_server.models.api_response_status import ApiResponseStatus

from app.application.services.note_service import NoteApplicationService
from app.shared.dependencies import get_note_service

router = APIRouter(prefix="/notes", tags=["Public Notes"])


@router.get("", response_model=NoteListResponse)
async def get_public_notes(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    note_service: NoteApplicationService = Depends(get_note_service),
):
    """Retrieve a list of public notes."""
    offset = (page - 1) * limit
    domain_notes = await note_service.get_public_notes(limit=limit, offset=offset)

    # Convert domain models to Pydantic models
    public_notes = [
        PublicNote(
            id=note.id,
            title=note.title,
            content=note.content,
            author="Anonymous",  # Placeholder
            created_at=note.created_at.isoformat(),
            updated_at=note.updated_at.isoformat(),
            is_public=True,
        )
        for note in domain_notes
    ]

    # We don't have total count; infer has_next from page size.
    has_next = len(public_notes) == limit
    inferred_total = offset + len(public_notes) + (1 if has_next else 0)

    pagination = Pagination(
        page=page,
        limit=limit,
        total=inferred_total,
        has_next=has_next,
        has_prev=page > 1,
    )

    response_data = NoteListResponseData(notes=public_notes, pagination=pagination)

    return NoteListResponse(status=ApiResponseStatus.SUCCESS, data=response_data)
