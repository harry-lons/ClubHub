import pytest
from fastapi.testclient import TestClient

from src.app import app, start_db

# from .utils import client


def test_login_token(client):
    """Test if we can actually login with valid name and password"""
    response = client.post(
        "/user/login", data={"username": "username1@example.com", "password": "password"}
    )
    assert response.status_code == 200
    assert len(response.json()) > 0  # Response is not empty


def test_login_token_bad(client):
    """The login should fail with invalid credientials"""
    response = client.post(
        "/user/login", data={"username": "fake_username", "password": ""}
    )
    assert response.status_code == 401
