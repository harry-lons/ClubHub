from typing import List
import uuid
from pydantic import BaseModel


class ClubID(BaseModel):
    id: str


class Club(ClubID):
    # id: int
    name: str
    contact_email: str


class UserID(BaseModel):
    id: uuid.UUID


class User(UserID):
    # id: int
    username: str
    first_name: str
    last_name: str


class UserAndClubs(User):
    # list of club ids
    followed_clubs: List[ClubID]


class ClubWithBoardMembers(Club):
    board_members: List[UserID]


class UserProfilePictureImgKey(BaseModel):
    key: str
