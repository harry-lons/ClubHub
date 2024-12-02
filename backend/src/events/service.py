from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status

from ..authentication import service as auth_service
from ..authentication.schemas import User
from ..authentication.utils import useracc_to_user
from ..database import DB
from ..db_store.conversion import b_club_to_f_club_full, b_event_to_f_event
from ..db_store.models import Events, UserRSVPs
from ..identities.schemas import Club,UserIDList, UserInfo, UserList, ClubInfo, ClubList
from .constants import fake_event_1, mock_events
# from ..db_store.
from .rsvp import rsvp_user_create, rsvp_user_delete, rsvp_user_get

# from ..app import app

from .schemas import Event, ListOfEvents, EventID, EventIDList, RSVP, RSVPList, Follow,EventListInfo,ClubIDList


app = APIRouter()


@app.get("/events", response_model=ListOfEvents)
async def get_events() -> ListOfEvents:
    all_events = DB.db.get_all_events()
    all_events_api = [b_event_to_f_event(e) for e in all_events]
    return ListOfEvents(events=all_events_api)


@app.get("/eventlistinfo", response_model=EventListInfo)
async def get_events(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
) -> EventListInfo:
    # Get all events
    all_events = DB.db.get_all_events()
    all_events_api = [b_event_to_f_event(e) for e in all_events]
    # Get all clubs
    all_clubs = DB.db.get_all_clubs()
    all_clubs_api = [b_club_to_f_club_full(e) for e in all_clubs]
    # Get rsvp events of user
    user = DB.db.get_user_from_id(current_user.id)
    rsvp_events: List[Events] = user.events
    rsvp_events_api = [b_event_to_f_event(e) for e in rsvp_events]
    # Get followed club ids of user
    follows = DB.db.fetch_user_follows(user_id=current_user.id)
    follow_id = [e[0] for e in follows]
    return EventListInfo(events=all_events_api, clubs=all_clubs_api, rsvp=rsvp_events_api, follow_id=follow_id)


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
    rsvp_events = RSVPList(rsvps=[])
    rsvp = DB.db.fetch_rsvp(user_id=current_user.id)
    rsvp_events.rsvps = [RSVP(user_id=r.user_id,event_id=r.event_id) for r in rsvp]
    return rsvp_events

@app.get("/RSVP/Attendees/{event_id}", response_model=UserList, tags=["user"])
async def rsvp_event(event_id: int) -> UserList:

    '''
    Fetches all attendees given a certain event
    '''
    attendees = UserList(users=[])
    users_rsvp = DB.db.fetch_rsvp_attendees(event_id=event_id)

    attendees.users = [useracc_to_user(DB.db.get_user_from_id(u[0])) for u in users_rsvp]
    return attendees

@app.post("/Follow", tags=["user"])
async def follow_club (
    current_user: Annotated[User, Depends(auth_service.get_current_user)], follow: Follow
)-> bool:
    '''
    follows a certain club
    '''
    res = DB.db.follow_club(user_id=current_user.id, club_id=follow.club_id)
    return res

@app.delete("/unfollow/{club_id}", tags=["user"])
async def unfollow_club (
    current_user: Annotated[User, Depends(auth_service.get_current_user)], club_id: str
)-> bool:
    '''
    unfollows a certain club
    '''
    res = DB.db.unfollow_club(user_id=current_user.id, club_id=club_id)
    return res

@app.get("/user/followed", tags=["user"])
async def user_followers(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
)-> ClubList:
    '''
    obtains all the clubs followed by the user
    '''
    clubs_followed = ClubList(clubs=[])
    follows = DB.db.fetch_user_follows(user_id=current_user.id)

    clubs_followed.clubs = [e[0] for e in follows]
    return clubs_followed


@app.get("/followed/{club_id}", tags=["user"])
async def follow_status(
    current_user: Annotated[User, Depends(auth_service.get_current_user)], club_id: str
)->bool:
    '''
    check if user follows a certain club
    '''
    res = DB.db.fetch_follow_status(user_id=current_user.id, club_id=club_id)
    return res

@app.get("/club/followers", response_model=UserList, tags=["club"])
async def fetch_followers(
    current_club: Annotated[Club, Depends(auth_service.get_current_logged_in_club)]
)->UserList:
    followers = UserList(users=[])
    user_followers = DB.db.fetch_club_followers(club_id=current_club.id)
    if len(user_followers) != 0:
        user_followers = [UserInfo(id=user_followers[i][0], username=user_followers[i][1], first_name=user_followers[i][2], last_name=user_followers[i][3], followed_clubs=user_followers[i][4]) for i in range(len(user_followers))]
        followers.users = user_followers
    return followers
    

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


@app.get("/user/myevents", response_model=ListOfEvents, tags=["user", "event"])
async def user_follow_events(
    current_user: Annotated[User, Depends(auth_service.get_current_user)]
):
    """Returns the events that a user follows (is RSVP'd)"""
    user = DB.db.get_user_from_id(id=current_user.id)
    events: List[Events] = user.events
    events_api = [b_event_to_f_event(e) for e in events]
    return ListOfEvents(events=events_api)


@app.get("/club/{club_id}/events", response_model=ListOfEvents, tags=["club", "events"])
async def get_club_events(club_id: str):
    """Get all the events of the club with id=club_id"""
    club = DB.db.get_org_from_id(club_id)
    events = ListOfEvents(events=[b_event_to_f_event(event) for event in club.events])
    return events

# @app.get("/events/past", response_model=EventCalendarData, tags=["club", "event"])
# async def user_past_events(
#     current_club: Annotated[Club, Depends(auth_service.get_current_logged_in_club)],
# ):
#     """Returns the events that a user has attended in the past."""
#     user = DB.db.get_user_from_id(current_user.id)
#     now = datetime.now(timezone.utc)  # Current timestamp in UTC
    
#     # Filter the user's events to include only those with end_time < now
#     past_events = [event for event in user.events if event.end_time < now]
    
#     # Convert the filtered events to the required API format
#     events_api = [b_event_to_f_event(event) for event in past_events]
    
#     return EventCalendarData(events=events_api)