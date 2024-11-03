from typing import Annotated

from fastapi import APIRouter, Depends, FastAPI

import authentication.service as auth_service
from authentication.schemas import User

# from ..app import app
from .schemas import Event, EventCalendarData

app = APIRouter()
mock_events = EventCalendarData(
    events=[Event(name="foo", event_id=1), Event(name="bar", event_id=2)]
)


@app.get("/events", response_model=EventCalendarData)
async def get_events(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
) -> EventCalendarData:
    return mock_events
