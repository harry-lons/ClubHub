from datetime import datetime
from typing import Dict, List, Optional, Tuple, Type

from pydantic import BaseModel, Field

from ..identities.schemas import ClubWithBoardMembers


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
    recurrence: bool
    recurrence_type: Optional[int]
    stop_date: Optional[datetime]
    capacity: Optional[int]
    summary: str = Field(default="")
    pictures: List[str] = Field(default=[])
    type: List[str]


class ListOfEvents(BaseModel):
    events: List[Event]
    
class ClubIDList(BaseModel):
    clubs:List[str]

class EventListInfo(BaseModel):
    events: List[Event]
    clubs: List[ClubWithBoardMembers]
    rsvp: List[Event]
    follow_id: List[str]

class RSVP(BaseModel):
    user_id: str
    event_id: int
    
class Follow(BaseModel):
    user_id: str
    club_id: str

class RSVPList(BaseModel):
    rsvps: List[RSVP]

class EventIDList(BaseModel):
    events: List[int]
    
