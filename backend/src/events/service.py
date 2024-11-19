from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from ..authentication import service as auth_service
from ..authentication.schemas import User
from ..database import DB
from .constants import fake_event_1, mock_events
from .rsvp import rsvp_user_create, rsvp_user_delete, rsvp_user_get

# from ..app import app
from .schemas import Event, EventCalendarData, EventID, EventIDList, EventWithoutID

app = APIRouter()


@app.get("/events", response_model=EventCalendarData)
async def get_events(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
) -> EventCalendarData:
    return mock_events


@app.get("/event/{id}", response_model=Event)
async def event(id: str) -> Event:
    # Vivian Modified
    event = DB.db.get_f_event(id)
    return event


@app.post("/rsvp/{event_id}")
async def rsvp_enter(
    current_user: Annotated[User, Depends(auth_service.get_current_user)], event_id: int
) -> bool:
    """RSVPs the currently loged in user to the event `event_id`. Returns a boolean determining
    whether adding is successful."""
    res = await rsvp_user_create(current_user.id, event_id)
    return res


@app.delete("/rsvp/{event_id}")
async def rsvp_delete(
    current_user: Annotated[User, Depends(auth_service.get_current_user)], event_id: int
) -> bool:
    """Removes a RSVP of the currently loged in user to event `event_id`. Returns a boolean
    determining whether the operation was successful."""
    res = await rsvp_user_delete(current_user.id, event_id)
    return res


@app.get("/rsvp/", response_model=EventIDList)
async def rsvp(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
) -> EventIDList:
    events = await rsvp_user_get(current_user.id)
    return events


@app.post("/club/event")
async def add_event(
    current_club_id: Annotated[str, Depends(auth_service.get_current_logged_in_club)],
    new_event: Event,
) -> int:
    """A logged-in club can create an event. Returns the newly created event's id.

    Pass in an Event object. The `id` attribute and `club_id` attribute can be anything, they are
    ignored."""
    print(new_event)
    # try:
    event_id = DB.db.create_event(new_event, current_club_id)
    return event_id
    # except ValueError:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Error",
    #     )


@app.patch("/club/event")
async def update_event(
    current_club_id: Annotated[str, Depends(auth_service.get_current_logged_in_club)],
    event: Event,
) -> bool:
    """Updates an event. Takes an Event object, which has updated fields."""
    if event.club_id != current_club_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Updated event's club id does not match yours.",
        )
    # try:
    DB.db.edit_event(event)
    return True
    # except ValueError as exc:
    #     return False


@app.delete("/club/event/{event_id}")
async def delete_event(
    current_club_id: Annotated[str, Depends(auth_service.get_current_logged_in_club)],
    event_id: int,
) -> bool:
    """
    Delete's the currently logged in club's event with `event_id`
    """
    event = DB.db.get_f_event(event_id)

    if event.club_id != current_club_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Updated event's club id does not match yours.",
        )
    # try:
    DB.db.delete_event(event_id)
    return True
    # except ValueError as exc:
    #     return False
