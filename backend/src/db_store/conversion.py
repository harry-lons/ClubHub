"""
Utilities for converting frontend objects (as seeen in various schemas.py) to
database objects (in db_store/models.py)
"""

from ..events.schemas import Event as FrontendEventObject
from ..identities.schemas import Club as FrontendClubObject
from ..identities.schemas import ClubWithBoardMembers as FrontendClubBoardMembers
from .models import ClubAccounts
from .models import ClubAccounts as DBClubObject
from .models import EventImages
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
        capacity=event.capacity,
        summary=event.summary,
        tags=[],
    )

    db_event.club = parent_club

    # Add or fetch related tags from the Event model
    tags = []
    for tag_name in event.type:
        tag = session.query(EventTags).filter(EventTags.tag_name == tag_name).first()
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
        capacity=db_event.capacity,
        summary=db_event.summary,
        pictures=[image.object_id for image in db_event.images],
        type=[tag.tag_name for tag in db_event.tags],
    )


def b_club_to_f_club(club: DBClubObject) -> FrontendClubObject:
    """Convert SQLAlchemy Club object to API's Pydantic Club Object"""
    return FrontendClubObject(id=club.id, name=club.name, contact_email=club.email)


def b_club_to_f_club_full(club: DBClubObject) -> FrontendClubBoardMembers:
    board_members = [user.id for user in club.members]
    return FrontendClubBoardMembers(
        id=club.id, name=club.name, contact_email=club.email, board_members=board_members
    )
