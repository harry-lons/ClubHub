from pathlib import Path

import pytest

TEST_DIR = Path(__file__).resolve().parent
RESOURCES_DIR = TEST_DIR / "resources"


@pytest.fixture()
def user_auth_header(client):
    """Authenticates a user, and returns the headers needed to authenticate."""

    # TODO function to reset user state (as state persists on server)

    test_user = {"username": "username1@example.com", "password": "password"}

    response = client.post("/user/login", data=test_user)
    assert response.status_code == 200
    token = response.json().get("access_token")
    assert token is not None

    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def club_auth_header(client):
    """Logs in a club, and returns headers needed to authenticate"""

    valid_club = {"username": "cats@example.com", "password": "clubpassword"}

    response = client.post("/club/login", data=valid_club)
    assert response.status_code == 200
    token = response.json().get("access_token")
    assert token is not None

    return {"Authorization": f"Bearer {token}"}
