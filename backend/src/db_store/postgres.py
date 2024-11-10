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
            account = Accounts(
                id=account_id,
                email=email,
                hashed_password=hashed_pass,
                account_type="user",
                profile_picture="",
            )

            user_account = UserAccounts(
                id=account_id,
                first_name=first_name,
                last_name=last_name,
            )

            self.session.add(account)
            self.session.add(user_account)
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
            account = Accounts(
                id=account_id,
                email=email,
                hashed_password=hashed_pass,
                account_type="organization",
                profile_picture="",
            )

            org_account = ClubAccounts(id=account_id, name=name)

            self.session.add(account)
            self.session.add(org_account)
            self.session.commit()

            return account_id

        except IntegrityError:
            self.session.rollback()
            raise ValueError(f"Server error")

    def get_user_from_id(self, id: str) -> Tuple[Accounts, UserAccounts]:
        acc = self._get_by(Accounts, id=id)
        if not acc:
            raise ValueError(f"Account with id {id} not found.")
        user_acc = acc.user_account
        if not user_acc:
            raise ValueError(f"No corresponding user account attached to id")
        return acc, user_acc

    def get_user_from_email(self, email: str) -> Tuple[Accounts, UserAccounts]:
        acc = self._get_by(Accounts, email=email)
        if not acc:
            raise ValueError(f"User with email {email} not found.")
        user_acc = acc.user_account
        if not user_acc:
            raise ValueError(
                f"No user account details found for account with email {email}."
            )

        return acc, user_acc

    def get_org_from_id(self, id: str) -> Tuple[Accounts, ClubAccounts]:
        acc = self._get_by(Accounts, id=id)
        if not acc:
            raise ValueError(f"Organization with id {id} not found.")
        club_acc = acc.club_account
        if not club_acc:
            raise ValueError(f"No corresponding club account attached to id")
        return acc, club_acc

    def get_org_from_email(self, email: str) -> Tuple[Accounts, ClubAccounts]:
        acc = self._get_by(Accounts, email=email)
        if not acc:
            raise ValueError(f"Organization with email {email} not found.")
        club_acc = acc.club_account
        if not club_acc:
            raise ValueError(f"No corresponding club account attached to id")
        return acc, club_acc

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
