from abc import ABC, abstractmethod
from typing import Any, Tuple

from ..events.schemas import Event
from .models import *


class IAuth(ABC):
    """Interface for Database queries relating to authentication"""

    @abstractmethod
    def add_user(
        self, email: str, hashed_pass: str, first_name: str, last_name: str
    ) -> str:
        pass

    @abstractmethod
    def add_organization(self, email: str, hashed_pass: str, name: str) -> str:
        pass

    @abstractmethod
    def get_user_from_id(self, id: str) -> UserAccounts:
        pass

    @abstractmethod
    def get_user_from_email(self, email: str) -> UserAccounts:
        pass

    @abstractmethod
    def get_org_from_id(self, id: str) -> ClubAccounts:
        pass

    @abstractmethod
    def get_org_from_email(self, email: str) -> ClubAccounts:
        pass


class IEvents(ABC):
    """Interface for Databaes queries related to events"""

    @abstractmethod
    def get_f_event(self, event_id: int) -> Event:
        """Get the event with id `event_id`"""
        pass

    @abstractmethod
    def create_event(self, event: Event, club_id: str) -> int:
        """Club with `club_id` adds an event to the database. Returns the newly
        created event's id."""
        pass

    @abstractmethod
    def edit_event(self, event: Event):
        """
        The caller must check that the club has the permissions to be making this
        edit. That is, the event's id is equal to the editing club's id."""
        pass

    @abstractmethod
    def delete_event(self, event_id: int):
        """A club can delete an event. Also remove all the RSVPs for said event."""
        pass


class IDatabase(ABC):
    @abstractmethod
    def get(self, model: Any, id: int) -> Any:
        """Retrieve an item from the database by id."""
        pass

    @abstractmethod
    def create(self, model: Any, data: dict) -> Any:
        """Create a new record in the database."""
        pass

    @abstractmethod
    def update(self, model: Any, id: int, data: dict) -> Any:
        """Update an existing record in the database."""
        pass

    @abstractmethod
    def delete(self, model: Any, id: int) -> None:
        """Delete a record from the database."""
        pass
