from typing import Annotated

from fastapi import APIRouter, Depends

from ..authentication import service as auth_service
from ..authentication.schemas import User
from .constants import fake_event_1, mock_events
from .rsvp import rsvp_user_create, rsvp_user_delete, rsvp_user_get

# from ..app import app
from .schemas import Event, EventCalendarData, EventID, EventIDList

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


@app.post("/rsvp/{event_id}")
async def rsvp_enter(
    current_user: Annotated[User, Depends(auth_service.get_current_user)], event_id: int
) -> None:
    await rsvp_user_create(current_user.id, event_id)


@app.delete("/rsvp/{event_id}")
async def rsvp_delete(
    current_user: Annotated[User, Depends(auth_service.get_current_user)], event_id: int
) -> None:
    await rsvp_user_delete(current_user.id, event_id)


@app.get("/rsvp/", response_model=EventIDList)
async def rsvp(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
) -> EventIDList:
    events = await rsvp_user_get(current_user.id)
    return events
