from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

from .. import ENV
from ..events.constants import fake_event_1, fake_event_2
from .models import (
    Base,
    ClubAccounts,
    ClubBoardMembers,
    EventImages,
    Events,
    EventTagAssociations,
    EventTags,
    UserAccounts,
    UserRSVPs,
)
from .postgres import PostgresDatabase

url = URL.create(
    drivername="postgresql+psycopg",
    username=ENV["PG_USERNAME"],
    password=ENV["PG_PASSWORD"],
    host=ENV["PG_HOST"],
    port=int(ENV["PG_PORT"]),
    database=ENV["PG_DATABASE"],
)


def create_tables():
    engine = create_engine(url)
    conn = engine.connect()

    Session = sessionmaker(bind=engine)
    session = Session()

    Base.metadata.create_all(engine)

    # check if tables exist
    try:
        result = conn.execute(
            text(
                "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
            )
        )
        print("Tables in the database:")
        for table in result:
            print(table[0])  # table[0] contains the table name
    except Exception as e:
        print("Error connecting to the database:", e)


def init_main_data(db: PostgresDatabase):
    event_types = [
        "social",
        "workshop",
        "networking",
        "fundraiser",
        "competition",
        "seminar",
        "community service",
        "cultural",
        "recreational",
        "generalMeeting",
        "academic",
        "orientation",
        "careerDevelopment",
        "volunteering",
        "panel",
        "celebration",
        "sports",
        "arts",
        "training",
        "research",
        "food",
    ]

    for tag in event_types:
        db.add_tag(tag)


def init_test_data(db: PostgresDatabase):

    db.add_user(
        "username1@example.com",
        "$argon2id$v=19$m=65536,t=3,p=4$KYUwppQyxjgnBIBQyrkXAg$OmDVsUIY90aOTyvp0kbrtLuSKsSaewP64MfSDEwH7+w",
        first_name="f",
        last_name="l",
    )
    db.add_user(
        "email@gmail.com",
        "$argon2id$v=19$m=65536,t=3,p=4$KYUwppQyxjgnBIBQyrkXAg$OmDVsUIY90aOTyvp0kbrtLuSKsSaewP64MfSDEwH7+w",
        "First2",
        "Last2",
    )

    # password: clubpassword
    db.add_organization(
        "cats@example.com",
        "$argon2id$v=19$m=65536,t=3,p=4$7b03BgAgZEwJwVhLCYHwPg$6rjLJCluu2ezwN7zqYRYZ4XG6BaLP38GNgIKXVZJgJM",
        "Cat Club",
    )

    new_club = db.get_org_from_email("cats@example.com")

    fake_event_1.club_id = new_club.id

    db.create_event(fake_event_1, new_club.id)  # should have id 1
    # db.create_event(fake_event_2, new_club.id)

    print("Testing queries")
    print(db.get_user_from_email("username1@example.com"))


# If we directly run as a script
# (python -m src.db_store.main)
if __name__ == "__main__":
    create_tables()

    engine = create_engine(url)
    conn = engine.connect()

    Session = sessionmaker(bind=engine)
    session = Session()

    Base.metadata.create_all(engine)

    db = PostgresDatabase(session)

    init_main_data(db)
    init_test_data(db)
