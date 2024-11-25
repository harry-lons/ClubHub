from datetime import datetime
from enum import Enum

from fastapi import HTTPException, status

from .schemas import Event, ListOfEvents

fake_event_1 = Event(
    id=1,  # will autoincrement
    title="Lunch",
    club_id="1",
    location="Earth",
    begin_time=datetime(2024, 11, 3, 5),
    end_time=datetime(2024, 11, 3, 6),
    recurrence=False,
    recurrence_type=None,
    stop_date=None,
    capacity=101,
    type=["social"],
)

fake_event_2 = Event(
    id=2,
    title="Cat Party",
    club_id="2",
    location="Cat Cafe",
    begin_time=datetime(2024, 11, 3, 20),
    end_time=datetime(2024, 11, 3, 22),
    recurrence=False, 
    recurrence_type=None, 
    stop_date=None,
    capacity=None,
    type=["food"],
)

fake_event_3 = Event(
    id=3,
    title="Dog Party",
    club_id="3",
    location="Dog Cafe",
    begin_time=datetime(2024, 11, 4, 20),
    end_time=datetime(2024, 11, 4, 22),
    recurrence=(False, None, None),
    capacity=None,
    type=["food"],
)

fake_event_3 = Event(
    id=3,
    title="Dog Party",
    club_id="3",
    location="Dog Cafe",
    begin_time=datetime(2024, 11, 4, 20),
    end_time=datetime(2024, 11, 4, 22),
    recurrence=(False, None, None),
    capacity=None,
    type=["food"],
)


mock_events = ListOfEvents(events=[fake_event_1, fake_event_2])

## RSVPs


class UserGoingStatus(Enum):
    ATTENDING = 1
    NOT_ATTENDING = 2
    TENTATIVE = 3


USER_ALREADY_RSVP = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="User is already RSVP'd for this event. Unable to add entry.",
)

USER_NOT_RSVP = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="User is not currently RSVP'd for this event. Unable to delete entry.",
)
