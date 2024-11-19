"""
Utilities for converting frontend objects (as seeen in various schemas.py) to
database objects (in db_store/models.py)
"""

from ..events.schemas import Event as FrontendEventObject
from ..events.schemas import EventWithoutID as FrontendNewEventObject
from .models import ClubAccounts, EventImages
from .models import Events as DBEventObject
from .models import EventTags


def f_event_to_b_event(
    session, parent_club: ClubAccounts, event: FrontendEventObject
) -> DBEventObject:
    """Convert API's Pydantic Event object to the SQLAlchemy Event Object"""
    # Convert Pydantic Event object to DB Events model
    db_event = DBEventObject(
        id=event.id,
        title=event.title,
        club_id=event.club_id,
        location=event.location,
        begin_time=event.begin_time,
        end_time=event.end_time,
        recurrence=event.recurrence[0],
        recurrence_type=event.recurrence[1],
        recurrence_stop_date=event.recurrence[2],
        summary=event.summary,
        tags=[],
    )

    db_event.club = parent_club

    # Add or fetch related tags from the Event model
    tags = []
    for tag_name in event.type:
        tag = session.query(EventTags).filter(EventTags.name == tag_name).first()
        if not tag:
            raise ValueError("Specified tags do not exist in database")
        tags.append(tag)

    # Associate the tags with the db_event
    db_event.tags = tags

    # TODO pictures

    db_event.attendees = []
    db_event.images = []

    return db_event


def b_event_to_f_event(db_event: DBEventObject) -> FrontendEventObject:
    """Convert SQLAlchemy Event Object to the API's Pydantic Event object"""
    return FrontendEventObject(
        id=db_event.id,
        title=db_event.title,
        club_id=db_event.club_id,
        location=db_event.location,
        begin_time=db_event.begin_time,
        end_time=db_event.end_time,
        recurrence=(
            db_event.recurrence,
            db_event.recurrence_type,
            db_event.recurrence_stop_date,
        ),
        summary=db_event.summary,
        pictures=[image.object_id for image in db_event.images],
        type=[tag.name for tag in db_event.tags],
    )
