# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

from generated_fastapi_server.models.error_response import ErrorResponse
from generated_fastapi_server.models.update_user_profile_request import UpdateUserProfileRequest
from generated_fastapi_server.models.user_profile_response import UserProfileResponse
from generated_fastapi_server.security_api import get_token_SessionAuth, get_token_BearerAuth

class BaseUserProfileApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseUserProfileApi.subclasses = BaseUserProfileApi.subclasses + (cls,)
    async def get_user_profile(
        self,
    ) -> UserProfileResponse:
        """Get current user&#39;s profile information (regular users only). Anonymous users will receive a 403 error. """
        ...


    async def update_user_profile(
        self,
        body: UpdateUserProfileRequest,
    ) -> UserProfileResponse:
        """Update current user&#39;s profile information (regular users only). Anonymous users will receive a 403 error. """
        ...
