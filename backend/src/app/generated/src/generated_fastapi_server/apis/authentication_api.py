# coding: utf-8

from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from generated_fastapi_server.apis.authentication_api_base import BaseAuthenticationApi
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
from generated_fastapi_server.models.anonymous_auth_request import AnonymousAuthRequest
from generated_fastapi_server.models.auth_response import AuthResponse
from generated_fastapi_server.models.error_response import ErrorResponse
from generated_fastapi_server.models.login_request import LoginRequest
from generated_fastapi_server.models.promote_request import PromoteRequest
from generated_fastapi_server.models.session_response import SessionResponse
from generated_fastapi_server.models.signup_request import SignupRequest
from generated_fastapi_server.security_api import get_token_SessionAuth, get_token_BearerAuth

router = APIRouter()

ns_pkg = generated_fastapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/auth/anonymous",
    responses={
        200: {"model": AuthResponse, "description": "Anonymous authentication successful, session cookie set"},
        400: {"model": ErrorResponse, "description": "Invalid Firebase token"},
    },
    tags=["Authentication"],
    summary="Anonymous user authentication",
    response_model_by_alias=True,
)
async def authenticate_anonymous(
    body: AnonymousAuthRequest = Body(None, description=""),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AuthResponse:
    """Exchange a Firebase anonymous ID token for a session cookie.  **Database Operation**:  - If this is a new anonymous user, their data will be inserted into the database - If this is an existing anonymous user, no database changes are made  **Use Cases**: - First visit to My Notebook page - Clicking \&quot;My Notebook\&quot; button from home page """
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().authenticate_anonymous(body)


@router.post(
    "/auth/login",
    responses={
        200: {"model": AuthResponse, "description": "Login successful, session cookie set"},
        400: {"model": ErrorResponse, "description": "Invalid Firebase token or credentials"},
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
    },
    tags=["Authentication"],
    summary="Regular user login",
    response_model_by_alias=True,
)
async def login_regular_user(
    body: LoginRequest = Body(None, description=""),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AuthResponse:
    """Exchange a Firebase regular user ID token for a session cookie.  **Database Operation**:  - No database changes (user already exists)  **Use Cases**: - Existing regular users logging in - Email/password authentication """
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().login_regular_user(body)


@router.post(
    "/auth/logout",
    responses={
        200: {"model": AuthResponse, "description": "Logout successful"},
        400: {"model": ErrorResponse, "description": "Bad request"},
    },
    tags=["Authentication"],
    summary="Clear session cookie",
    response_model_by_alias=True,
)
async def logout(
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
) -> AuthResponse:
    """Logout and clear the session cookie.  This does not affect the Firebase client-side authentication state.  **Database Operation**:  - No database changes """
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().logout()


@router.post(
    "/auth/promote",
    responses={
        200: {"model": AuthResponse, "description": "Anonymous user successfully promoted to regular account"},
        400: {"model": ErrorResponse, "description": "Invalid request data or linking failed"},
        409: {"model": ErrorResponse, "description": "Account with these credentials already exists"},
        401: {"model": ErrorResponse, "description": "Authentication required (must be logged in as anonymous user)"},
    },
    tags=["Authentication"],
    summary="Promote anonymous user to regular account",
    response_model_by_alias=True,
)
async def promote_anonymous_user(
    body: PromoteRequest = Body(None, description=""),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AuthResponse:
    """Convert an anonymous user to a regular user account using Firebase linkWithCredential. This preserves the user&#39;s existing data while upgrading their account.  **Database Operation**:  - Update existing anonymous user data in database (anonymous → regular) - Same UID is preserved, isAnonymous flag changes to false  **Use Cases**: - Anonymous users upgrading to regular accounts - Preserves all existing notes and data """
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().promote_anonymous_user(body)


@router.post(
    "/auth/signup",
    responses={
        201: {"model": AuthResponse, "description": "New user account created successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request data or Firebase token"},
        409: {"model": ErrorResponse, "description": "User already exists"},
    },
    tags=["Authentication"],
    summary="New regular user registration",
    response_model_by_alias=True,
)
async def signup_new_user(
    body: SignupRequest = Body(None, description=""),
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> AuthResponse:
    """Exchange a Firebase new user ID token for a session cookie and create user profile.  **Database Operation**:  - Insert new regular user data into the database  **Use Cases**: - Brand new users creating regular accounts (not from anonymous) - Direct signup without anonymous session """
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().signup_new_user(body)


@router.get(
    "/auth/session",
    responses={
        200: {"model": SessionResponse, "description": "Session is valid"},
        401: {"model": ErrorResponse, "description": "Invalid or expired session"},
    },
    tags=["Authentication"],
    summary="Verify current session",
    response_model_by_alias=True,
)
async def verify_session(
    token_SessionAuth: TokenModel = Security(
        get_token_SessionAuth
    ),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> SessionResponse:
    """Verify the current session and return user information. This endpoint also ensures the user exists in the database and will create  an anonymous user record if needed.  **Database Operation**:  - May insert anonymous user data if session exists but user not in DB """
    if not BaseAuthenticationApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseAuthenticationApi.subclasses[0]().verify_session()
