# coding: utf-8

from fastapi.testclient import TestClient


from generated_fastapi_server.models.anonymous_auth_request import AnonymousAuthRequest  # noqa: F401
from generated_fastapi_server.models.auth_response import AuthResponse  # noqa: F401
from generated_fastapi_server.models.error_response import ErrorResponse  # noqa: F401
from generated_fastapi_server.models.login_request import LoginRequest  # noqa: F401
from generated_fastapi_server.models.promote_request import PromoteRequest  # noqa: F401
from generated_fastapi_server.models.session_response import SessionResponse  # noqa: F401
from generated_fastapi_server.models.signup_request import SignupRequest  # noqa: F401


def test_authenticate_anonymous(client: TestClient):
    """Test case for authenticate_anonymous

    Anonymous user authentication
    """
    body = null

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/anonymous",
    #    headers=headers,
    #    json=body,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_login_regular_user(client: TestClient):
    """Test case for login_regular_user

    Regular user login
    """
    body = null

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/login",
    #    headers=headers,
    #    json=body,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_logout(client: TestClient):
    """Test case for logout

    Clear session cookie
    """

    headers = {
        "SessionAuth": "special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/logout",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_promote_anonymous_user(client: TestClient):
    """Test case for promote_anonymous_user

    Promote anonymous user to regular account
    """
    body = null

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/promote",
    #    headers=headers,
    #    json=body,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_signup_new_user(client: TestClient):
    """Test case for signup_new_user

    New regular user registration
    """
    body = null

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/auth/signup",
    #    headers=headers,
    #    json=body,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_verify_session(client: TestClient):
    """Test case for verify_session

    Verify current session
    """

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/auth/session",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

