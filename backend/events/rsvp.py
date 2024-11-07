from typing import List

from .constants import USER_ALREADY_RSVP, USER_NOT_RSVP, UserGoingStatus
from .schemas import EventIDList

# TODO add database option

definitely_a_database = set()


async def rsvp_user_create(user_id: int, event_id: int):
    """RSVPs a person to the event"""
    entry = (user_id, event_id, UserGoingStatus.ATTENDING)
    if entry in definitely_a_database:
        raise USER_ALREADY_RSVP
    definitely_a_database.add(entry)


async def rsvp_user_delete(user_id: int, event_id: int):
    """Removes a RSVP from an event"""
    entry = (user_id, event_id, UserGoingStatus.ATTENDING)
    if entry not in definitely_a_database:
        raise USER_NOT_RSVP
    definitely_a_database.remove(entry)


async def rsvp_user_get(user_id: int) -> EventIDList:
    """Gets a list of RSVPs a person has"""
    rsvps = filter(lambda entry: entry[0] == user_id, definitely_a_database)
    event_ids = [b for _, b, _ in rsvps]
    return EventIDList(events=event_ids)
