from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

from ..__init__ import ENV
from ..db_store.models import ClubBoardMembers, UserRSVPs
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
    UserFollows
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

    # TODO convert these to constants
    test_user_1 = db.add_user(
        "username1@example.com",
        "$argon2id$v=19$m=65536,t=3,p=4$KYUwppQyxjgnBIBQyrkXAg$OmDVsUIY90aOTyvp0kbrtLuSKsSaewP64MfSDEwH7+w",
        first_name="f",
        last_name="l",
    )
    test_user_2 = db.add_user(
        "email@gmail.com",
        "$argon2id$v=19$m=65536,t=3,p=4$KYUwppQyxjgnBIBQyrkXAg$OmDVsUIY90aOTyvp0kbrtLuSKsSaewP64MfSDEwH7+w",
        "First2",
        "Last2",
    )

    # password: password
    test_user_3 = db.add_user(
        "person3@example.com",
        "$argon2id$v=19$m=65536,t=3,p=4$FiKkFOLcO0eI0Xqv1Zpzjg$XNLSvLQuWkVG2rOzXWrmeaJYEL+d/Bcq68HFMqI1Odo",
        "Three",
        "Green",
    )

    # password: password
    test_user_4 = db.add_user(
        "person4@example.com",
        "$argon2id$v=19$m=65536,t=3,p=4$I8R47x0j5Lw3JkTI+Z8TAg$ZGhD5HP7sVFxvEVkj8UfWead2nlDQytaz9bjaU4SOy8",
        "Four",
        "Orange",
    )

    # password: clubpassword
    test_club_1 = db.add_organization(
        "cats@example.com",
        "$argon2id$v=19$m=65536,t=3,p=4$7b03BgAgZEwJwVhLCYHwPg$6rjLJCluu2ezwN7zqYRYZ4XG6BaLP38GNgIKXVZJgJM",
        "Cat Club",
        "cat club description"
    )

    board_member_user_3_club_1 = ClubBoardMembers(
        user_id=test_user_3, club_id=test_club_1
    )
    db.session.add(board_member_user_3_club_1)

    fake_event_1.club_id = test_club_1
    db.create_event(fake_event_1, test_club_1)  # should have id 1

    print(test_user_1)
    user_3_follow_club = UserFollows(user_id=test_user_3, club_id=test_club_1)
    db.session.add(user_3_follow_club)
    
    user_4_rsvp_event_1 = UserRSVPs(user_id=test_user_1, event_id=1)
    db.session.add(user_4_rsvp_event_1)

    db.session.commit()

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
