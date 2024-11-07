from fastapi.testclient import TestClient

from src.app import app

client = TestClient(app)


def test_login_token():
    """Test if we can actually login with valid name and password"""
    response = client.post(
        "/token", data={"username": "username1", "password": "password"}
    )
    assert response.status_code == 200
    assert len(response.json()) > 0  # Response is not empty


def test_login_token_bad():
    """The login should fail with invalid credientials"""
    response = client.post("/token", data={"username": "fake_username", "password": ""})
    assert response.status_code == 401
