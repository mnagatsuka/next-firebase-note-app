# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, StrictStr  # noqa: F401
from typing import Any, Optional  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from generated_fastapi_server.models.create_note_request import CreateNoteRequest  # noqa: F401
from generated_fastapi_server.models.error_response import ErrorResponse  # noqa: F401
from generated_fastapi_server.models.private_note_list_response import PrivateNoteListResponse  # noqa: F401
from generated_fastapi_server.models.private_note_response import PrivateNoteResponse  # noqa: F401
from generated_fastapi_server.models.update_note_request import UpdateNoteRequest  # noqa: F401


def test_create_user_note(client: TestClient):
    """Test case for create_user_note

    Create new private note
    """
    body = null

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/me/notes",
    #    headers=headers,
    #    json=body,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_delete_user_note(client: TestClient):
    """Test case for delete_user_note

    Delete private note
    """

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/me/notes/{id}".format(id='550e8400-e29b-41d4-a716-446655440000'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_get_user_note(client: TestClient):
    """Test case for get_user_note

    Get user's private note
    """

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/me/notes/{id}".format(id='550e8400-e29b-41d4-a716-446655440000'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_get_user_notes(client: TestClient):
    """Test case for get_user_notes

    List user's private notes
    """
    params = [("page", 1),     ("limit", 20)]
    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/me/notes",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_update_user_note(client: TestClient):
    """Test case for update_user_note

    Update private note
    """
    body = null

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PATCH",
    #    "/me/notes/{id}".format(id='550e8400-e29b-41d4-a716-446655440000'),
    #    headers=headers,
    #    json=body,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

