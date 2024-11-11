from abc import ABC, abstractmethod
from typing import Any, Tuple

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
