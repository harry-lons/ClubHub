from .schemas import EventModel, EventCalendarData
from datetime import datetime

fake_event_1 = EventModel(
    name="Lunch",
    event_id=1,
    location="Earth",
    time=datetime(2024, 11, 3, 5),
    type="other",
)

fake_event_2 = EventModel(
    name="Cat Party",
    event_id=2,
    location="Felis",
    time=datetime(2024, 11, 3, 20),
    type="party",
)

fake_event_3 = EventModel(
    name="Big Speech",
    event_id=3,
    location="Price Center Ballroom",
    time=datetime(2024, 11, 3, 2),
    type="food",
)

mock_events = EventCalendarData(events=[fake_event_1, fake_event_2, fake_event_3])
