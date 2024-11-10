from abc import ABC, abstractmethod
from typing import Any


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
