import logging
import uuid
from typing import Any, Dict, List, Optional, Tuple, Type, TypeVar

from sqlalchemy.exc import (
    IntegrityError,
    MultipleResultsFound,
    NoResultFound,
    SQLAlchemyError,
)
from sqlalchemy.orm import Session

from ..events.schemas import Event as FrontendEvent
from .conversion import b_event_to_f_event, f_event_to_b_event
from .db_interface import IAuth, IDatabase, IEvents
from .models import *

M = TypeVar("M")
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)


class PostgresDatabase(IAuth, IEvents):
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
            # self.session.commit()

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
                description=""
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

    def get_all_clubs(self) -> List[ClubAccounts]:
        entries = self.session.query(ClubAccounts).all()
        return entries

    def get_all_events(self) -> List[FrontendEvent]:
        entries = self.session.query(Events).all()
        return entries

    def get_f_event(self, event_id: int) -> FrontendEvent:
        event = self._get_by(Events, id=event_id)
        return b_event_to_f_event(event)

    def create_event(self, event: FrontendEvent, club_id: str) -> int:
        try:
            event.club_id = club_id
            parent_club = self.get_org_from_id(club_id)
            new_event = f_event_to_b_event(self.session, parent_club, event)

            # If we set it to None, it will automatically set the id through autoincrement
            new_event.id = None  # type: ignore

            self.session.add(new_event)
            self.session.commit()

            if new_event.id is None:
                print("Event id is None")
                raise ValueError(f"Unable to obtain id of newly added event")

            return new_event.id
        except IntegrityError:
            self.session.rollback()
            raise ValueError(f"Server error")

    def edit_event(self, event: FrontendEvent):
        parent_club = self.get_org_from_id(event.club_id)
        original_event = self.get_f_event(event.id)

        if original_event.club_id != parent_club.id:
            # The club trying to edit the event is NOT the owner of this event
            raise ValueError("Invalid Permissions to edit this event")

        new_event = f_event_to_b_event(self.session, parent_club, event)
        self._update(Events, new_event, id=new_event.id)
        self.session.commit()

    def delete_event(self, event_id: int):
        event = self._get_by(Events, id=event_id)  # Fetch the event
        try:

            with self.session.begin_nested():  # Create a savepoint
                # Delete related UserRSVPs and EventTagAssociations
                self.session.query(UserRSVPs).filter_by(event_id=event.id).delete()
                self.session.query(EventTagAssociations).filter_by(
                    event_id=event.id
                ).delete()
                self._delete(Events, id=event_id)
            self.session.commit()

        except SQLAlchemyError as e:
            # If anything goes wrong, rollback the transaction
            self.session.rollback()
            raise ValueError(f"Error deleting event {event_id}: {e}")

    def add_tag(self, tag: str):
        existing_tag = (
            self.session.query(EventTags).filter(EventTags.tag_name == tag).first()
        )

        if existing_tag is not None:
            raise Exception(f"Tag {tag} already exist in database.")

        new_tag = EventTags(tag_name=tag)

        self.session.add(new_tag)

    def add_rsvp_user(self, user_id: str, event_id: int) -> bool:
        '''
        Adds a user-event pair into the UserRSVP table
        '''
        ## perform a check (previously RSVP'd or event does not exist)
        if not self.session.query(Events).filter_by(id=event_id).first() \
            or self.session.query(UserRSVPs).filter_by(user_id=user_id,event_id=event_id).all():
                return False
        try:
            rsvp_user = UserRSVPs(user_id=user_id, event_id=event_id)
            self.session.add(rsvp_user)
            self.session.commit()

            return True

        except IntegrityError:
            # If anything goes wrong, rollback the transaction
            self.session.rollback()
            raise ValueError(f"Server Error while creating RSVP")

    def remove_rsvp_user(self, user_id: str, event_id: int)-> bool:
        '''
        Removes a user-event pair from the UserRSVP table
        It first checks for existence of the user-event pair
        '''
        try:
            self.session.query(UserRSVPs).filter_by(user_id=user_id, event_id=event_id).delete()
            self.session.commit()

            return True
        except SQLAlchemyError as e:
            # If anything goes wrong, rollback the transaction
            self.session.rollback()
            raise ValueError(f"Error deleting RSVP: {e}")

    def fetch_rsvp(self, user_id: str)-> List[UserRSVPs]:
        '''
        Fetches all the rsvps that a specific user
        '''
        # user = self._get_by(UserAccounts, id=user_id) ## fetch the user
        rsvps = self.session.query(UserRSVPs).filter_by(user_id=user_id).all()
        if len(rsvps) == 0:
            raise ValueError(f"User {user_id} has not RSVP'd for any events")
        return rsvps


    def fetch_rsvp_attendees(self, event_id: int)-> List[str]:
        '''
        Fetches all the users who have RSVP'd for a
        specified event
        '''
        #event = self._get_by(Events, id=event_id) ## fetch the event
        users = self.session.query(UserRSVPs.user_id).filter_by(event_id=event_id).all()
        if len(users) == 0:
            raise ValueError(f"Event is not an RSVP'd event")
        return users



    def follow_club (self, user_id: str, club_id: str) -> bool:
        '''
        Adds a user-club pair to the UserFollows table
        '''
        ## perform a check (previously followed or the club does not exist)
        if not self.session.query(ClubAccounts).filter_by(id=club_id).first() \
            or self.session.query(UserFollows).filter_by(user_id=user_id, club_id=club_id).all():
                return False
        try:
            user_club = UserFollows(user_id=user_id, club_id=club_id)
            self.session.add(user_club)
            self.session.commit()

            return True

        except IntegrityError:
            # If anything goes wrong, rollback the transaction
            self.session.rollback()
            raise ValueError(f"Server Error while following club")

    def unfollow_club (self,  user_id: str, club_id: str) -> bool:
        '''
        Removes a user-club pair from the UserFollow table
        It firsts check for the existence of the user-club pair
        '''
        if not self.session.query(UserFollows).filter_by(user_id=user_id, club_id=club_id).first():
            return False
        try:
            self.session.query(UserFollows).filter_by(user_id=user_id, club_id=club_id).delete()
            self.session.commit()

            return True
        except SQLAlchemyError as e:
            # If anything goes wrong, rollback the transaction
            self.session.rollback()
            raise ValueError(f"Error unfollowing club: {e}")

    def fetch_user_follows(self, user_id: str)-> List[str]:
        '''
        Returns all the followed
        '''
        follows = self.session().query(UserFollows.club_id).filter_by(user_id=user_id).all()
        if len(follows) == 0:
            raise ValueError(f"User follows no club!")
        return follows

    def fetch_follow_status(self, user_id:str, club_id: str )-> bool:
        '''
        Checks if a user has followed a certain club
        '''
        status = self.session.query(UserFollows).filter_by(user_id=user_id, club_id=club_id).first()
        if status == None:
            return False
        else:
            return True

    def fetch_club_followers(self, club_id: str)-> List[str]:
        '''
        Fetches all the users who have followed a club
        '''
        users = self.session.query(UserFollows.user_id).filter_by(club_id=club_id).all()
        if len(users) == 0:
            raise ValueError(f"Club has no followers!")
        return users


    def _get_by(self, model: Type[M], **filters) -> M:
        """Fetch an object by arbitrary filters. Returns an object of type `model`.

        Example: `_get_by(model=..., id="5", email="abc@y.com)` returns the first model with
        attributes id="5" and email="abc@y.com" """

        # TODO How the heck do I type hint **filters? Dict, dict don't work

        try:
            query = self.session.query(model)
            for field, value in filters.items():
                query = query.filter(getattr(model, field) == value)
            res = query.one()
        except (NoResultFound, MultipleResultsFound):
            raise ValueError("An incorrect amount of results were returned")
        if res is None:
            raise ValueError("No result returned")
        return res

    def _create(self, model: Any, data: dict) -> Any:
        instance = model(**data)
        self.session.add(instance)
        self.session.commit()
        return instance

    def _update(self, model: Type[M], data: M, **filters):
        """Updates the `model` found using `filters` to the new data in `data`.

        This function is equivalent to `_get_by` or `query(model).filter_by(filters)`,
        except then the found item is updated with data."""
        query = self.session.query(model).filter_by(**filters)

        try:
            # Try to get exactly one instance that matches the filters
            instance = query.one()
        except NoResultFound:
            raise ValueError(f"No record found matching the filters: {filters}")
        except MultipleResultsFound:
            raise ValueError(f"Multiple records found matching the filters: {filters}")

        # Update the found instance with the new data
        for key, value in data.__dict__.items():
            # Skip internal attributes that SQLAlchemy uses, such as '_sa_instance_state'
            if key.startswith("_sa_"):
                continue
            setattr(instance, key, value)
        return instance

    def _delete(self, model: Type[M], num_items: Optional[int] = 1, **filters) -> None:
        """Deletes records from `model` found using `filters`. Optionally, delete exactly `num_items` records.

        If `num_items` is `None`, delete all matching records. If `num_items` is specified,
        only delete if the number of records found matches `num_items`.
        """
        query = self.session.query(model).filter_by(**filters)

        num_items_found = query.count()

        if num_items is None:
            # Delete all records if num_items is None
            query.delete(synchronize_session=False)
        else:
            if num_items_found != num_items:
                raise ValueError(
                    f"Expected to delete {num_items} records, but found {num_items_found}."
                )
            else:
                query.delete(synchronize_session=False)
