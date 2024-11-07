from typing import Annotated
from io import BytesIO
import tempfile

from ..authentication import service as auth_service
from ..authentication.schemas import User
from fastapi import APIRouter, Depends, FastAPI, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse, Response

from .schemas import Club, ClubWithBoardMembers, UserProfilePictureImgKey
from .constants import cat_club, cat_club_board_members
from ..object_store import InMemoryFileStorage, IStorage

app = APIRouter()

object_db: IStorage = InMemoryFileStorage()
definitely_a_database = dict()  # TODO


@app.get("/club", response_model=ClubWithBoardMembers)
def club(club_id: int) -> ClubWithBoardMembers:
    return cat_club_board_members


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
    response_class=FileResponse,
)
async def get_profile_picture(
    current_user: Annotated[User, Depends(auth_service.get_current_user)],
):
    profile_pic_key: str = definitely_a_database[current_user.id]
    file = await object_db.get_file(profile_pic_key)

    return Response(file.read(), media_type="image/png")

    # returns file (it is BinaryIO)
