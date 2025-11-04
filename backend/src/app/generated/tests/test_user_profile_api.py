# coding: utf-8

from fastapi.testclient import TestClient


from generated_fastapi_server.models.error_response import ErrorResponse  # noqa: F401
from generated_fastapi_server.models.update_user_profile_request import UpdateUserProfileRequest  # noqa: F401
from generated_fastapi_server.models.user_profile_response import UserProfileResponse  # noqa: F401


def test_get_user_profile(client: TestClient):
    """Test case for get_user_profile

    Get user profile
    """

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/me",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_update_user_profile(client: TestClient):
    """Test case for update_user_profile

    Update user profile
    """
    body = null

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PATCH",
    #    "/me",
    #    headers=headers,
    #    json=body,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

