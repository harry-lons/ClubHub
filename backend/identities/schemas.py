from typing import List

from pydantic import BaseModel


class ClubID(BaseModel):
    id: int


class Club(ClubID):
    # id: int
    name: str
    contact_email: List[str]


class UserID(BaseModel):
    id: int


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
