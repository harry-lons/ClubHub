from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from src.app import app

TEST_DIR = Path(__file__).resolve().parent
RESOURCES_DIR = TEST_DIR / "resources"

# from .utils import client


@pytest.fixture()
def test_user():
    return {"username": "username1", "password": "password"}


@pytest.fixture()
def auth_header(client):
    """Authenticates a user, and returns the headers needed to authenticate."""

    # TODO function to reset user state (as state persists on server)

    test_user = {"username": "username1@example.com", "password": "password"}

    response = client.post("/user/login", data=test_user)
    assert response.status_code == 200
    token = response.json().get("access_token")
    assert token is not None

    return {"Authorization": f"Bearer {token}"}


def test_upload_profile_picture(client, auth_header):
    """Upload a profile picture"""

    with open(RESOURCES_DIR / "pink.png", "rb") as pink_test_img:
        files = {"file": (pink_test_img.name, pink_test_img)}
        response = client.post(
            "/myself/upload_profile_picture", headers=auth_header, files=files
        )
        assert response.status_code == 200
        assert response.json()["key"]


def test_download_profile_picture(client, auth_header):
    """Download the previously uploaded profile picture in `test_upload_image` and verify
    its contents"""

    # I think this will always execute after the function it depends on, as it is later in the file

    with open(RESOURCES_DIR / "pink.png", "rb") as pink_test_img:
        response = client.get("/myself/profile_picture", headers=auth_header)
        assert response.status_code == 200
        assert response.headers["Content-Type"] == "image/png"

        response_data = response.content
        pink_file_data = pink_test_img.read()
        assert response_data == pink_file_data
