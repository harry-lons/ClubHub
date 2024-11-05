from typing import Annotated

from ..authentication import service as auth_service
from fastapi import APIRouter, Depends, FastAPI

from .schemas import Club, ClubWithBoardMembers
from .constants import cat_club, cat_club_board_members

app = APIRouter()


@app.get("/club", response_model=ClubWithBoardMembers)
def club(club_id: int) -> ClubWithBoardMembers:
    return cat_club_board_members
