from datetime import datetime
from typing import Dict, List, Optional, Tuple, Type

from pydantic import BaseModel, Field


class EventID(BaseModel):
    id: int


# If we don't want strict fields (e. don't want to have to actually
# specify location=None, and want the ability to leave it out, then
# we can do Optional[str] = Field(default=None) using Field
# from pydantic
class Event(EventID):
    # id: int
    title: str
    club_id: str
    location: str = Field(default="")
    begin_time: datetime
    end_time: datetime
    recurrence: Tuple[bool, Optional[int], Optional[datetime]]
    summary: str = Field(default="")
    pictures: List[str] = Field(default=[])
    type: List[str]


# Has all the attributes as Event, but without the `id` attribute. This data
# is passed in when creating  an event - as when creating an event, the entity
# creating does not know the id of the event (the id is created later by the backend)
class EventWithoutID(BaseModel):
    # id: int
    title: str
    # club_id: int
    location: str = Field(default="")
    begin_time: datetime
    end_time: datetime
    recurrence: str
    summary: str = Field(default="")
    pictures: List[str] = Field(default=[])
    type: List[str]  # for now


class EventCalendarData(BaseModel):
    events: List[Event]


class RSVP(BaseModel):
    user_id: int
    event_id: int


class EventIDList(BaseModel):
    events: List[int]
