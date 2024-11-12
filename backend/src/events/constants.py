from datetime import datetime
from enum import Enum

from fastapi import HTTPException, status

from .schemas import Event, EventCalendarData

fake_event_1 = Event(
    id="1",
    title="Lunch",
    club_id="5",
    location="Earth",
    begin_time=datetime(2024, 11, 3, 5),
    end_time=datetime(2024, 11, 3, 6),
    recurrence="",
    type=["other"],
)

fake_event_2 = EventModel(
    id=2,
    title="Cat Party",
    club_id=2,
    location="Felis",
    begin_time=datetime(2024, 11, 4, 20),
    end_time=datetime(2024, 11, 4, 21),
    recurrence=False,
    type="party",
)

fake_event_3 = EventModel(
    id=3,
    title="Big Speech",
    club_id=3,
    location="Price Center Ballroom",
    begin_time=datetime(2024, 11, 3, 2),
    end_time=datetime(2024, 11, 3, 3),
    recurrence=False,
    type="food",
)

mock_events = EventCalendarData(
    events=[
        fake_event_1,
        fake_event_2, fake_event_3
    ]
)

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
