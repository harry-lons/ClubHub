import tempfile
from io import BytesIO
from typing import Annotated

from fastapi import APIRouter, Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, Response

from ..authentication import service as auth_service
from ..authentication.schemas import User
from ..database import DB
from ..db_store.conversion import b_club_to_f_club_full
from ..object_store import InMemoryFileStorage, IStorage
from .constants import cat_club, cat_club_board_members
from .schemas import AllClubs, Club, ClubWithBoardMembers, UserProfilePictureImgKey

app = APIRouter()

object_db: IStorage = InMemoryFileStorage()
definitely_a_database = dict()  # TODO


@app.get("/club", response_model=ClubWithBoardMembers)
def club(club_id: str) -> ClubWithBoardMembers:
    club_obj = DB.db.get_org_from_id(club_id)
    club = b_club_to_f_club_full(club_obj)
    return club


async def validate_file(file: BytesIO):
    MAX_FILE_SIZE = 2_000_000  # 2MB
    ACCEPTED_FILE_TYPES = ["image/png"]

    # TODO
    return True


@app.post("/myself/upload_profile_picture", response_model=UserProfilePictureImgKey)
async def upload_profile_picture(
    current_user: Annotated[User, Depends(auth_service.get_current_user)],
    file: UploadFile,
):
    """User can upload a their profile pictures. Stores profile picture such that
    we can retrieve it later with the current_user id."""

    key = await object_db.upload_file(file.file)
    definitely_a_database[current_user.id] = key
    return UserProfilePictureImgKey(key=key)


@app.get(
    "/myself/profile_picture",
    responses={200: {"content": {"image/png": {}}}},
    response_class=Response,
)
async def get_profile_picture(
    current_user: Annotated[User, Depends(auth_service.get_current_user)],
):
    profile_pic_key: str = definitely_a_database[current_user.id]
    file = await object_db.get_file(profile_pic_key)

    return Response(file.read(), media_type="image/png")

    # returns file (it is BinaryIO)


@app.get("/clubs", response_model=AllClubs)
async def get_all_clubs() -> AllClubs:
    """Get a list of all clubs"""
    all_clubs = DB.db.get_all_clubs()
    all_clubs_api = [b_club_to_f_club_full(e) for e in all_clubs]
    return AllClubs(clubs=all_clubs_api)
