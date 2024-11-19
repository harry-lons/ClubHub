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
    recurrence=(False, None, None),
    capacity=101,
    type=["other"],
)

# fake_event_2 = EventModel(
#     name="Cat Party",
#     event_id=2,
#     location="Felis",
#     time=datetime(2024, 11, 3, 20),
#     type="party",
# )

# fake_event_3 = EventModel(
#     name="Big Speech",
#     event_id=3,
#     location="Price Center Ballroom",
#     time=datetime(2024, 11, 3, 2),
#     type="food",
# )

mock_events = EventCalendarData(
    events=[
        fake_event_1,
        # fake_event_2, fake_event_3
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
