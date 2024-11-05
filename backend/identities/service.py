from typing import Annotated

from ..authentication import service as auth_service
from fastapi import APIRouter, Depends, FastAPI

from .schemas import Club
from .constants import cat_club

app = APIRouter()


@app.get("/club", response_model=Club)
def club(club_id: int) -> Club:
    return cat_club
