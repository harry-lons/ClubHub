from abc import ABC, abstractmethod
from typing import BinaryIO


class IStorage(ABC):
    """Interface for object file storage"""

    @abstractmethod
    async def upload_file(self, file: BinaryIO) -> str:
        """Adds a file to our database. Raises an exception if error occurs. Returns
        the file's key"""
        pass

    @abstractmethod
    async def get_file(self, key: str) -> BinaryIO:
        """Retrieves file from our database. Raises exception if error occurs"""
        pass
