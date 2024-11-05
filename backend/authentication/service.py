from datetime import timedelta
from typing import Annotated, Dict

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

from .constants import BAD_CREDIENTIALS_EXCEPTION
from .schemas import BearerToken, UserLogin
from ..identities.schemas import User

# creds: username1:password
fake_users_db = {
    "username1": {
        "username": "username1",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$KYUwppQyxjgnBIBQyrkXAg$OmDVsUIY90aOTyvp0kbrtLuSKsSaewP64MfSDEwH7+w",
    }
}

app = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    return pwd_context.hash(password)


def get_user_from_db(db, username: str) -> UserLogin:
    """Returns a User information from the database.
    Throws ValueError if the user does not exist.
    """
    if username not in db:
        raise ValueError()
    user = UserLogin(**db[username])
    return user


def authenticate_user(db, username: str, entered_passwd: str) -> UserLogin:
    """Returns the user record for a given username and password.
    If incorrect credientials, throws ValueError"""

    # get user data from db based on username
    if username not in db:
        raise ValueError()
    user = UserLogin(**db[username])

    if not verify_password(entered_passwd, user.hashed_password):
        raise ValueError()
    return user


def create_access_token(data: Dict, expires_in: timedelta) -> str:
    """Creates a jwt token from data."""
    to_encode = data.copy()
    to_encode.update({"expiry": expires_in})
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    """Validates a given (bearer) token. If the token is correct, returns
    the user the token corresponds to."""

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise BAD_CREDIENTIALS_EXCEPTION
    except InvalidTokenError:
        raise BAD_CREDIENTIALS_EXCEPTION

    try:
        user_from_db = get_user_from_db(fake_users_db, username)
        user = user_from_db.to_user()
    except ValueError:
        raise BAD_CREDIENTIALS_EXCEPTION
    return user


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> BearerToken:
    try:
        user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    except ValueError:
        raise BAD_CREDIENTIALS_EXCEPTION

    # create new session token and add to database
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_in=access_token_expires
    )
    return BearerToken(access_token=access_token, token_type="bearer")


@app.get("/whoami/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Returns the current logged in user."""
    return current_user
