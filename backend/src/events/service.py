from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status

from ..authentication import service as auth_service
from ..authentication.schemas import User
from ..database import DB
from ..db_store.conversion import b_event_to_f_event
from ..db_store.models import Events, UserRSVPs
from ..identities.schemas import Club
from .constants import fake_event_1, mock_events
# from ..db_store.
from .rsvp import rsvp_user_create, rsvp_user_delete, rsvp_user_get

# from ..app import app
from .schemas import Event, EventCalendarData, EventID, EventIDList, RSVP, RSVPList
from ..identities.schemas import UserIDList

app = APIRouter()


@app.get("/events", response_model=EventCalendarData)
async def get_events(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
) -> EventCalendarData:
    raise HTTPException(status_code=status.HTTP_301_MOVED_PERMANENTLY)


@app.get("/event/{id}", response_model=Event)
async def event(id: int) -> Event:
    event = DB.db.get_f_event(id)
    return event


@app.post("/RSVP", tags=["user"])
async def rsvp_enter(
    current_user: Annotated[User, Depends(auth_service.get_current_user)], rsvp: RSVP
) -> bool:
    """RSVPs the currently loged in user to the event `event_id`. Returns a boolean determining
    whether adding is successful."""
    # res = await rsvp_user_create(current_user.id, event_id)
    res = DB.db.add_rsvp_user(current_user.id, rsvp.event_id)
    return res


@app.delete("/RSVP/{event_id}", tags=["user"])
async def rsvp_delete(
    current_user: Annotated[User, Depends(auth_service.get_current_user)], event_id: int
) -> bool:
    """Removes a RSVP of the currently loged in user to event `event_id`. Returns a boolean
    determining whether the operation was successful."""
    #res = await rsvp_user_delete(current_user.id, event_id)
    res = DB.db.remove_rsvp_user(current_user.id, event_id)
    return res


@app.get("/RSVP/rsvps", response_model=RSVPList, tags=["user"])
async def rsvp_user(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
) -> RSVPList:
    '''
    Fetches all the events the user has RSVP'd to 
    '''
    # events = await rsvp_user_get(current_user.id)
    rsvp_events = RSVPList(rsvps=[])
    rsvp = DB.db.fetch_rsvp(user_id=current_user.id)
    rsvp_events.rsvps = [RSVP(user_id=r.user_id,event_id=r.event_id) for r in rsvp]
    return rsvp_events

@app.get("/RSVP/Attendees/{event_id}", response_model=UserIDList, tags=["user"])
async def rsvp_event(
    current_club: Annotated[Club, Depends(auth_service.get_current_logged_in_club)], event_id: int
) -> UserIDList:
    '''
    Fetches all attendees given a certain event
    '''
    attendees = UserIDList(users=[])
    users_rsvp = DB.db.fetch_rsvp_attendees(event_id=event_id)
    attendees.users = users_rsvp
    return attendees

@app.post("/club/event", tags=["club", "event"])
async def add_event(
    current_club: Annotated[Club, Depends(auth_service.get_current_logged_in_club)],
    new_event: Event,
) -> int:
    """A logged-in club can create an event. Returns the newly created event's id.

    Pass in an Event object. The `id` attribute and `club_id` attribute can be anything, they are
    ignored."""
    # TODO change return to EventID
    # try:
    event_id = DB.db.create_event(new_event, current_club.id)
    return event_id
    # except ValueError:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Error",
    #     )


@app.patch("/club/event", tags=["club", "event"])
async def update_event(
    current_club: Annotated[Club, Depends(auth_service.get_current_logged_in_club)],
    event: Event,
) -> bool:
    """Updates an event. Takes an Event object, which has updated fields."""
    if event.club_id != current_club.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Updated event's club id does not match yours.",
        )
    # try:
    DB.db.edit_event(event)
    return True
    # except ValueError as exc:
    #     return False


@app.delete("/club/event/{event_id}", tags=["club", "event"])
async def delete_event(
    current_club: Annotated[Club, Depends(auth_service.get_current_logged_in_club)],
    event_id: int,
) -> bool:
    """
    Delete's the currently logged in club's event with `event_id`
    """
    event = DB.db.get_f_event(event_id)

    if event.club_id != current_club.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Updated event's club id does not match yours.",
        )
    # try:
    DB.db.delete_event(event_id)
    return True
    # except ValueError as exc:
    #     return False


@app.get("/user/myevents", response_model=EventCalendarData, tags=["user", "event"])
async def user_follow_events(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
):
    """Returns the events that a user follows (is RSVP'd)"""
    user = DB.db.get_user_from_id(current_user.id)
    events: List[Events] = user.events
    events_api = [b_event_to_f_event(e) for e in events]
    return EventCalendarData(events=events_api)
