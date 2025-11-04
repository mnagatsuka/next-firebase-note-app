"""FastAPI dependencies and DI container wiring."""
from __future__ import annotations

import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.infra.auth.firebase_auth_service import FirebaseAuthService
from app.application.services.note_service import NoteApplicationService
from app.application.services.user_service import UserApplicationService
from app.application.services.auth_service import AuthApplicationService
from app.infra.repositories.dynamodb_note_repository import DynamoDBNoteRepository
from app.infra.repositories.dynamodb_user_repository import DynamoDBUserRepository


logger = logging.getLogger(__name__)

# HTTP Bearer for Firebase ID tokens
bearer_scheme = HTTPBearer(auto_error=True)


# Infra adapters
def get_firebase_auth_service() -> FirebaseAuthService:
    return FirebaseAuthService()


def get_note_repository() -> DynamoDBNoteRepository:
    return DynamoDBNoteRepository()


def get_user_repository() -> DynamoDBUserRepository:
    return DynamoDBUserRepository()


# Application services
def get_note_service(
    repo: DynamoDBNoteRepository = Depends(get_note_repository),
) -> NoteApplicationService:
    return NoteApplicationService(repo)


def get_user_service(
    repo: DynamoDBUserRepository = Depends(get_user_repository),
) -> UserApplicationService:
    return UserApplicationService(repo)


def get_auth_service(
    repo: DynamoDBUserRepository = Depends(get_user_repository),
) -> AuthApplicationService:
    return AuthApplicationService(repo)


# Authenticated user dependencies
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    auth_service: FirebaseAuthService = Depends(get_firebase_auth_service),
) -> dict:
    """Extract and verify Firebase ID token from Authorization header."""
    token = credentials.credentials
    try:
        decoded_token = auth_service.verify_id_token(token)
        return decoded_token
    except Exception:
        logger.exception("Failed to verify ID token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_regular_user(decoded_token: dict = Depends(get_current_user)) -> dict:
    """Ensure user is not anonymous."""
    if decoded_token.get("is_anonymous"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This action requires a non-anonymous user account.",
        )
    return decoded_token
