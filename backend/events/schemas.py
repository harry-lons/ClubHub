from datetime import datetime
from typing import Dict, List, Optional

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
    club_id: int
    location: str = Field(default="")
    begin_time: datetime
    end_time: datetime
    recurrence: bool
    summary: str = Field(default="")
    pictures: Dict = Field(default={})
    type: str  # for now


class EventModel(Event):
    # TODO change edit this
    """Event state to work with in the backend. We convert this to Event when sending
    it to the frontend (converting the datetime to string)"""

    # time: datetime

    # def to_event(self) -> Event:
    #     # Convert `time` to string representation in ISO format
    #     event_dict = self.model_dump()
    #     if isinstance(event_dict.get("time"), datetime):
    #         event_dict["time"] = event_dict["time"].isoformat()
    #     return Event(**event_dict)


class EventCalendarData(BaseModel):
    events: List[Event]


class RSVP(BaseModel):
    user_id: int
    event_id: int


class EventIDList(BaseModel):
    events: List[int]
