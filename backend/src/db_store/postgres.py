import uuid
from typing import Any, Dict, Tuple, Type, TypeVar

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .db_interface import IAuth, IDatabase
from .models import *

M = TypeVar("M")


class PostgresDatabase(IAuth):
    def __init__(self, session: Session):
        self.session = session

    def add_user(self, email: str, hashed_pass: str, first_name: str, last_name: str):
        try:
            account_id = str(uuid.uuid4())
            # TODO add default profile picture
            account = UserAccounts(
                id=account_id,
                email=email,
                hashed_password=hashed_pass,
                profile_picture="",
                first_name=first_name,
                last_name=last_name,
            )

            self.session.add(account)
            self.session.commit()

            return account_id

        except IntegrityError:
            self.session.rollback()
            raise ValueError(
                f"Error creating account. Does {email} already exist in the database?"
            )

    def add_organization(self, email: str, hashed_pass: str, name: str):
        try:
            account_id = str(uuid.uuid4())
            # TODO add default profile picture
            account = ClubAccounts(
                id=account_id,
                email=email,
                hashed_password=hashed_pass,
                profile_picture="",
                name=name,
            )

            self.session.add(account)
            self.session.commit()

            return account_id

        except IntegrityError:
            self.session.rollback()
            raise ValueError(f"Server error")

    def get_user_from_id(self, id: str) -> UserAccounts:
        acc = self._get_by(UserAccounts, id=id)
        if not acc:
            raise ValueError(f"Account with id {id} not found.")
        return acc

    def get_user_from_email(self, email: str) -> UserAccounts:
        acc = self._get_by(UserAccounts, email=email)
        if not acc:
            raise ValueError(f"User with email {email} not found.")
        return acc

    def get_org_from_id(self, id: str) -> ClubAccounts:
        acc = self._get_by(ClubAccounts, id=id)
        if not acc:
            raise ValueError(f"Organization with id {id} not found.")
        return acc

    def get_org_from_email(self, email: str) -> ClubAccounts:
        acc = self._get_by(ClubAccounts, email=email)
        if not acc:
            raise ValueError(f"Organization with email {email} not found.")
        return acc

    def _get_by(self, model: Type[M], **filters) -> M:
        """Fetch an object by arbitrary filters. Returns an object of type `model`.

        Example: `_get_by(model=..., id="5", email="abc@y.com)` returns the first model with
        attributes id="5" and email="abc@y.com" """

        # TODO How the heck do I type hint **filters? Dict, dict don't work

        query = self.session.query(model)
        for field, value in filters.items():
            query = query.filter(getattr(model, field) == value)
        res = query.first()
        if res is None:
            raise ValueError()
        return res

    def _create(self, model: Any, data: dict) -> Any:
        instance = model(**data)
        self.session.add(instance)
        self.session.commit()
        return instance

    def _update(self, model: Any, id: int, data: dict) -> Any:
        instance = self._get_by(model, id=id)
        for key, value in data.items():
            setattr(instance, key, value)
        self.session.commit()
        return instance

    def _delete(self, model: Any, id: int) -> None:
        instance = self._get_by(model, id=id)
        self.session.delete(instance)
        self.session.commit()
