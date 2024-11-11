from datetime import timedelta
from typing import Annotated, Dict

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

from ..identities.schemas import User
from .constants import BAD_CREDIENTIALS_EXCEPTION
from .schemas import BearerToken, UserLogin, UserSignup


## TODO: implement the merged(UserLogin and UserSignup) class across all the functions
# creds: username1:password
fake_users_db = {
    "username1": {
        "id": 5,
        "username": "username1",
        "first_name": "First",
        "last_name": "Last",
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

def authenticate_user2(db, username: str, entered_passwd: str) -> UserLogin:
    """Returns the user record for a given username and password.
    If incorrect credientials, throws ValueError"""
    # THIS IS FOR THE NEW FUNCTION, WITH DATABASE INTEGRATION

    # get user data from db based on username

    # TODO figure out how to have db be our postgress database
    # 1  we can call the function db.get_user_by_email(...) to get the user and the hashed password
    # 2  compare the entered password to the hashed_password (similar to below with `verify_password()`
    # 3  we create and return a UserLogin object (or we can change our API to return something more convinent)

    if username not in db:
        raise ValueError()
    user = UserLogin(**db[username])

    if not verify_password(entered_passwd, user.hashed_password):
        raise ValueError()
    return user

'''
checks if username is new to the database then hashes the password if all goes through
'''
def authenticate_signup(db, username: str, password: str)-> str:
    if username in db:
        raise ValueError("Username already exists!")
    return get_password_hash(password)

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

@app.post("/user/login")
async def user_login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> BearerToken:
    # todo change these to email
    # todo replace fake_users_db with actual database
    try:
        user = authenticate_user2(fake_users_db, form_data.username, form_data.password)
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

'''
End-point for user sign-ups; involves authenticating the signup 
before adding the authenticated new user to the database
'''
@app.post("/user/signup")
async def user_signup(user: UserSignup):
    ## checks if username was everused before
    hashed_password = authenticate_signup(fake_users_db, user.username, user.password) ## uses the fake_user_db
    if len(list(fake_users_db.keys())) > 0:
        fake_users_db[user.username] = {"id":fake_users_db[list(fake_users_db.keys())[-1]]["id"]+1, \
                                        "username": user.username, \
                                        "first_name": user.first_name, "last_name": user.last_name, "password": hashed_password}
    else:
        fake_users_db[user.username] = {"id": 0, \
                                        "username": user.username, \
                                        "first_name": user.first_name, "last_name": user.last_name, "password": hashed_password}