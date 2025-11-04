# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, StrictStr  # noqa: F401
from typing import Optional  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from generated_fastapi_server.models.error_response import ErrorResponse  # noqa: F401
from generated_fastapi_server.models.note_list_response import NoteListResponse  # noqa: F401
from generated_fastapi_server.models.note_response import NoteResponse  # noqa: F401


def test_get_public_note(client: TestClient):
    """Test case for get_public_note

    Get public note by ID
    """

    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/notes/{id}".format(id='550e8400-e29b-41d4-a716-446655440000'),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_list_public_notes(client: TestClient):
    """Test case for list_public_notes

    List latest public notes
    """
    params = [("page", 1),     ("limit", 20)]
    headers = {
        "SessionAuth": "special-key",
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/notes",
    #    headers=headers,
    #    params=params,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

