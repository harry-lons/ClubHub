from .schemas import EventModel, EventCalendarData
from datetime import datetime

fake_event_1 = EventModel(
    id=1,
    title="Lunch",
    club_id=5,
    location="Earth",
    begin_time=datetime(2024, 11, 3, 5),
    end_time=datetime(2024,11,3,6),
    recurrence=False,
    type="other",
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

mock_events = EventCalendarData(events=[fake_event_1, 
                                        # fake_event_2, fake_event_3
                                        ])
