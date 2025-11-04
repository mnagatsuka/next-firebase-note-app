# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from generated_fastapi_server.models.anonymous_auth_request import AnonymousAuthRequest
from generated_fastapi_server.models.auth_response import AuthResponse
from generated_fastapi_server.models.error_response import ErrorResponse
from generated_fastapi_server.models.login_request import LoginRequest
from generated_fastapi_server.models.promote_request import PromoteRequest
from generated_fastapi_server.models.session_response import SessionResponse
from generated_fastapi_server.models.signup_request import SignupRequest
from generated_fastapi_server.security_api import get_token_SessionAuth, get_token_BearerAuth

class BaseAuthenticationApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseAuthenticationApi.subclasses = BaseAuthenticationApi.subclasses + (cls,)
    async def authenticate_anonymous(
        self,
        body: AnonymousAuthRequest,
    ) -> AuthResponse:
        """Exchange a Firebase anonymous ID token for a session cookie.  **Database Operation**:  - If this is a new anonymous user, their data will be inserted into the database - If this is an existing anonymous user, no database changes are made  **Use Cases**: - First visit to My Notebook page - Clicking \&quot;My Notebook\&quot; button from home page """
        ...


    async def login_regular_user(
        self,
        body: LoginRequest,
    ) -> AuthResponse:
        """Exchange a Firebase regular user ID token for a session cookie.  **Database Operation**:  - No database changes (user already exists)  **Use Cases**: - Existing regular users logging in - Email/password authentication """
        ...


    async def logout(
        self,
    ) -> AuthResponse:
        """Logout and clear the session cookie.  This does not affect the Firebase client-side authentication state.  **Database Operation**:  - No database changes """
        ...


    async def promote_anonymous_user(
        self,
        body: PromoteRequest,
    ) -> AuthResponse:
        """Convert an anonymous user to a regular user account using Firebase linkWithCredential. This preserves the user&#39;s existing data while upgrading their account.  **Database Operation**:  - Update existing anonymous user data in database (anonymous → regular) - Same UID is preserved, isAnonymous flag changes to false  **Use Cases**: - Anonymous users upgrading to regular accounts - Preserves all existing notes and data """
        ...


    async def signup_new_user(
        self,
        body: SignupRequest,
    ) -> AuthResponse:
        """Exchange a Firebase new user ID token for a session cookie and create user profile.  **Database Operation**:  - Insert new regular user data into the database  **Use Cases**: - Brand new users creating regular accounts (not from anonymous) - Direct signup without anonymous session """
        ...


    async def verify_session(
        self,
    ) -> SessionResponse:
        """Verify the current session and return user information. This endpoint also ensures the user exists in the database and will create  an anonymous user record if needed.  **Database Operation**:  - May insert anonymous user data if session exists but user not in DB """
        ...
