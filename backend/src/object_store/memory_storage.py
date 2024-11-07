from io import BytesIO
from typing import Dict, Tuple, BinaryIO
from .store_interface import IStorage
import uuid
import tempfile
import os


class InMemoryFileStorage(IStorage):

    def __init__(self):
        self.tempdir = tempfile.TemporaryDirectory()

        # key: (filepath, original_file_name)
        self.files: Dict[str, Tuple[str, str]] = {}

    async def upload_file(self, file: BinaryIO) -> str:
        new_file_key = uuid.uuid4().__str__()
        temp_file_path = self._create_path(new_file_key)
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(file.read())

        self.files[new_file_key] = (temp_file_path, file.name)
        return new_file_key

    async def get_file(self, key: str) -> BinaryIO:
        temp_file_path, file_name = self.files[key]
        temp_file = open(temp_file_path, "rb")
        return temp_file

    def _create_path(self, key: str) -> str:
        return os.path.join(self.tempdir.name, key)

    def cleanup(self) -> None:
        self.tempdir.cleanup()

    def __del__(self):
        # ! Not sure if this is guaranteed to delete stuff
        self.cleanup()
