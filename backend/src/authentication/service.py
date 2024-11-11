from datetime import timedelta
from typing import Annotated, Dict

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

from ..database import DB
from ..identities.schemas import User
from .constants import BAD_CREDIENTIALS_EXCEPTION
from .schemas import BearerToken, ClubSignup, UserLogin, UserSignup
from .utils import useracc_to_user

## TODO: implement the merged(UserLogin and UserSignup) class across all the functions
# creds: username1:password
# fake_users_db = {
#     "username1": {
#         "id": 5,
#         "username": "username1",
#         "first_name": "First",
#         "last_name": "Last",
#         "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$KYUwppQyxjgnBIBQyrkXAg$OmDVsUIY90aOTyvp0kbrtLuSKsSaewP64MfSDEwH7+w",
#     }
# }

app = APIRouter()

oauth2_scheme_user_login = OAuth2PasswordBearer(
    tokenUrl="/user/login", scheme_name="user"
)
oauth2_scheme_club_login = OAuth2PasswordBearer(
    tokenUrl="/club/login", scheme_name="club"
)
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


def authenticate_user2(email: str, entered_passwd: str) -> UserLogin:
    """Returns the user record for a given username and password.
    If incorrect credientials, throws ValueError"""

    try:
        user_acc = DB.db.get_user_from_email(email)
    except ValueError as e:
        raise ValueError("User with email not in database") from e

    user = UserLogin(
        id=user_acc.id,
        username=user_acc.email,
        first_name=user_acc.first_name,
        last_name=user_acc.last_name,
        hashed_password=user_acc.hashed_password,
    )

    if not verify_password(entered_passwd, user.hashed_password):
        raise ValueError()
    return user


def authenticate_club(email: str, entered_pw: str) -> str:
    try:
        club_acc = DB.db.get_org_from_email(email)
    except ValueError as e:
        raise ValueError("Club with email not in database") from e

    if not verify_password(entered_pw, club_acc.hashed_password):
        raise ValueError()
    return club_acc.email


def authenticate_signup(db, username: str, password: str) -> str:
    if username in db:
        raise ValueError("Username already exists!")
    return get_password_hash(password)


def create_access_token(data: Dict, expires_in: timedelta) -> str:
    """Creates a jwt token from data."""
    to_encode = data.copy()
    to_encode.update({"expiry": expires_in})
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme_user_login)]
) -> User:
    """Validates a given (bearer) token. If the token is correct, returns
    the user the token corresponds to."""

    # TODO change this
    # ! Make sure not to allow user and club accounts with the same email to access eachother by
    # manipulating requests (use the "type" attribute of payload)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise BAD_CREDIENTIALS_EXCEPTION
    except InvalidTokenError:
        raise BAD_CREDIENTIALS_EXCEPTION

    try:
        user_from_db = DB.db.get_user_from_email(username)
        user = useracc_to_user(user_from_db)
    except ValueError:
        raise BAD_CREDIENTIALS_EXCEPTION
    return user


async def get_current_logged_in_club(
    token: Annotated[str, Depends(oauth2_scheme_club_login)]
) -> str:
    """Returns the currently loged in user's email"""
    # ! This is a development TEST function that should not make it to production
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise BAD_CREDIENTIALS_EXCEPTION
        return username
    except InvalidTokenError:
        raise BAD_CREDIENTIALS_EXCEPTION


@app.post("/user/login", tags=["user"])
async def user_login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> BearerToken:
    try:
        user = authenticate_user2(form_data.username, form_data.password)
    except ValueError:
        raise BAD_CREDIENTIALS_EXCEPTION

    # create new session token and add to database
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "type": "user"}, expires_in=access_token_expires
    )
    return BearerToken(access_token=access_token, token_type="bearer")


@app.post(
    "/user/signup",
    tags=["user"],
)
async def user_signup(info: UserSignup) -> str:
    try:
        DB.db.get_user_from_email(info.username)
        raise ValueError("This email is already associated with an account")
    except ValueError:
        # This email isn't in the database. Continue
        pass
    hashed_pw = get_password_hash(info.password)
    uuid = DB.db.add_user(info.username, hashed_pw, info.first_name, info.last_name)
    return uuid


@app.post("/club/login", tags=["club"])
async def club_login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> BearerToken:
    try:
        club_email = authenticate_club(form_data.username, form_data.password)
    except ValueError:
        raise BAD_CREDIENTIALS_EXCEPTION

    # create new session token and add to database
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": club_email, "type": "club"}, expires_in=access_token_expires
    )
    return BearerToken(access_token=access_token, token_type="bearer")


@app.post("/club/signup", tags=["club"])
async def club_signup(info: ClubSignup):
    """Create a new club account."""
    try:
        DB.db.get_org_from_email(info.email)
        raise ValueError("This email is already associated with a club account.")
    except ValueError:
        # If the email doesn't exist in the database, continue
        pass

    hashed_pw = get_password_hash(info.password)
    club_uuid = DB.db.add_organization(info.email, hashed_pw, info.name)
    return club_uuid


@app.get("/user/whoami/", response_model=User, tags=["user"])
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    # TODO Change this
    """Returns the current logged in user."""
    return current_user


@app.get("club/whoami", response_model=str, tags=["club"])
async def user_whoami(
    current_club: Annotated[str, Depends(get_current_logged_in_club)]
) -> str:
    return current_club
