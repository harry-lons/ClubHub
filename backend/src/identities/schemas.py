import uuid
from typing import List

from pydantic import BaseModel


class ClubID(BaseModel):
    id: str


class Club(ClubID):
    # id: int
    name: str
    contact_email: str

class ClubInfo(BaseModel):
    id: str
    name: str
    description: str
    board_members: List[str]
    contact_email: str | List[str]
    
class ClubList(BaseModel):
    clubs: List[ClubInfo]

class UserID(BaseModel):
    id: str


class UserIDList(BaseModel):
    users: List[str]


class User(UserID):
    #id: int
    username: str
    first_name: str
    last_name: str

class UserInfo(BaseModel):
    id: str
    username: str
    first_name: str
    last_name: str
    followed_clubs: List[str]
    
class UserList(BaseModel):
    users: List[UserInfo]


class UserAndClubs(User):
    # list of club ids
    followed_clubs: List[ClubID]


class ClubWithBoardMembers(Club):
    board_members: List[str]  # List of UserIDs
    description: str


class UserProfilePictureImgKey(BaseModel):
    key: str


class AllClubs(BaseModel):
    clubs: List[ClubWithBoardMembers]
