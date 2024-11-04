from typing import List

from pydantic import BaseModel


class Event(BaseModel):
    name: str
    event_id: int


class EventCalendarData(BaseModel):
    events: List[Event]
