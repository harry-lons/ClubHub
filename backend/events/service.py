from typing import Annotated

from ..authentication import service as auth_service
from ..authentication.schemas import User
from fastapi import APIRouter, Depends

# from ..app import app
from .schemas import Event, EventCalendarData
from .constants import fake_event_1, fake_event_2, fake_event_3, mock_events

app = APIRouter()


@app.get("/events", response_model=EventCalendarData)
async def get_events(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
) -> EventCalendarData:
    return mock_events


@app.get("/event/{id}", response_model=Event)
async def event(id: int) -> Event:
    # temp code
    return fake_event_1
