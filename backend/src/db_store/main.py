from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base

from .. import ENV
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

if __name__ == "__main__":
    engine = create_engine(url)
    conn = engine.connect()

    from sqlalchemy.orm import sessionmaker

    Session = sessionmaker(bind=engine)
    session = Session()

    Base.metadata.create_all(engine)

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

    db = PostgresDatabase(session=session)

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

    print("Testing queries")
    print(db.get_user_from_email("username1@example.com"))

    # x = db._get_by(Accounts, email="example@example.com")
    # print(x.id)

    conn.close()
