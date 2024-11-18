from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column, relationship

Base = declarative_base()


class UserAccounts(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    profile_picture: Mapped[str] = mapped_column(String, nullable=False)

    # Relationship back to Accounts
    # account = relationship("Accounts", back_populates="user_account")

    # Many-to-many relationship with Events (RSVPs)
    events = relationship("Events", secondary="user_rsvps", back_populates="attendees")

    # Many-to-many relationship with ClubAccounts (Board members)
    clubs = relationship(
        "ClubAccounts", secondary="club_board_members", back_populates="members"
    )


class ClubAccounts(Base):
    __tablename__ = "club_accounts"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    profile_picture: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)

    # Each ClubAccount has an Account
    # account = relationship("Accounts", back_populates="club_account")

    # Has many Events
    events = relationship("Events", back_populates="club")

    # Many-to-many relationship with UserAccounts (Board members)
    members = relationship(
        "UserAccounts", secondary="club_board_members", back_populates="clubs"
    )


class Events(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    club_id: Mapped[str] = mapped_column(
        String, ForeignKey("club_accounts.id"), nullable=False
    )
    location: Mapped[str] = mapped_column(String, nullable=False)
    begin_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    summary: Mapped[str] = mapped_column(String, nullable=True)
    recurrence: Mapped[str] = mapped_column(String, nullable=True)

    # Relationship back to ClubAccounts
    club = relationship("ClubAccounts", back_populates="events")

    # Many-to-many relationship with EventTags
    tags = relationship(
        "EventTags", secondary="event_tag_associations", back_populates="events"
    )

    # Many-to-many relationship with UserAccounts (RSVPs)
    attendees = relationship(
        "UserAccounts", secondary="user_rsvps", back_populates="events"
    )

    # one-to-many relationship with images
    images = relationship("EventImages", back_populates="event")


class EventTags(Base):
    __tablename__ = "event_tags"

    tag_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tag_name: Mapped[str] = mapped_column(String, nullable=False)

    # Many-to-many relationship with Events
    events = relationship(
        "Events", secondary="event_tag_associations", back_populates="tags"
    )


# *******************************************
# Association Tables


class UserRSVPs(Base):
    __tablename__ = "user_rsvps"

    user_id: Mapped[str] = mapped_column(
        String, ForeignKey("users.id"), primary_key=True
    )
    event_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("events.id"), primary_key=True
    )


# Association table for Board Members of ClubAccounts
class ClubBoardMembers(Base):
    __tablename__ = "club_board_members"

    user_id: Mapped[str] = mapped_column(
        String, ForeignKey("users.id"), primary_key=True
    )
    club_id: Mapped[str] = mapped_column(
        String, ForeignKey("club_accounts.id"), primary_key=True
    )


# Association table for Event-Tag associations
class EventTagAssociations(Base):
    __tablename__ = "event_tag_associations"

    event_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("events.id"), primary_key=True
    )
    tag_id: Mapped[int] = mapped_column(
        Integer, ForeignKey(EventTags.tag_id), primary_key=True
    )


# Association table for Event-Image associations
class EventImages(Base):
    __tablename__ = "event_images"

    event_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("events.id"), primary_key=True
    )
    object_id: Mapped[str] = mapped_column(String)

    event = relationship("Events", back_populates="images")
