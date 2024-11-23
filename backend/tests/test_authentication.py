from datetime import timedelta

import pytest

from src.app import app, start_db
from src.authentication.service import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_club,
    authenticate_user2,
    create_access_token,
)


def test_login_user(client):
    """Test if we can actually login with valid name and password"""
    response = client.post(
        "/user/login",
        data={"username": "username1@example.com", "password": "password"},
    )
    assert response.status_code == 200
    assert len(response.json()) > 0  # Response is not empty


def test_login_user_bad(client):
    """The login should fail with invalid credientials"""
    # with pytest.raises(HTTPException) as exc_info:
    response = client.post(
        "/user/login", data={"username": "fake_username", "password": ""}
    )
    assert response.status_code == 401
    # assert isinstance(exc_info.value, HTTPException)
    # assert exc_info.value.status_code == 404
    # assert exc_info.value.detail == "Email does not exist"


def test_user_token(client):
    """Create a token and test that session with this token works (giving this token
    allows the user to be authenticated)"""
    user = authenticate_user2("username1@example.com", "password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": "user"}, expires_in=access_token_expires
    )
    response = client.get(
        "/user/whoami", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) > 0, "Response is empty"

    assert response_data["username"] == "username1@example.com" == user.username
    assert response_data["first_name"] == user.first_name
    assert response_data["last_name"] == user.last_name


def test_user_token_expired(client):
    """A user submitting an expired login token should not be able to authenticate"""
    user = authenticate_user2("username1@example.com", "password")
    access_token_expires = timedelta(days=-1)  # Token is one day old
    access_token = create_access_token(
        data={"sub": user.username, "role": "user"}, expires_in=access_token_expires
    )
    response = client.get(
        "/user/whoami", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 401


def test_login_club(client):
    """Test if we login to a club with valid name and password"""
    response = client.post(
        "/club/login",
        data={"username": "cats@example.com", "password": "clubpassword"},
    )
    assert response.status_code == 200
    assert len(response.json()) > 0  # Response is not empty


def test_login_club_bad(client):
    """The login should fail with invalid credientials"""
    # with pytest.raises(HTTPException) as exc_info:
    response = client.post(
        "/club/login", data={"username": "fake_username", "password": ""}
    )
    assert response.status_code == 401


def test_club_token(client):
    """Create a token and test that session with this token works (giving this token
    allows the user to be authenticated)"""
    club = authenticate_club("cats@example.com", "clubpassword")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": club.contact_email, "role": "club"},
        expires_in=access_token_expires,
    )

    # Remember this returns an email
    response = client.get(
        "/club/whoami", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) > 0, "Response is empty"

    assert response_data["id"], response_data
    assert (
        response_data["contact_email"] == "cats@example.com" == club.contact_email
    ), response_data
    assert response_data["name"] == club.name, response_data
    assert len(response_data["board_members"]) == 1, response_data


def test_club_token_expired(client):
    """A club submitting an expired login token should not be able to authenticate"""
    club = authenticate_club("cats@example.com", "clubpassword")
    access_token_expires = timedelta(days=-1)  # Token is one day old
    access_token = create_access_token(
        data={"sub": club.contact_email, "role": "club"},
        expires_in=access_token_expires,
    )
    response = client.get(
        "/user/whoami", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 401
