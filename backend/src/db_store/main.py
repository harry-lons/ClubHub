from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base

from .models import (
    Accounts,
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
    username="username",
    password="examplepassword",
    host="127.0.0.1",
    port=5432,
    database="SoCalSocial",
)

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

db.create(
    Accounts,
    {
        "id": "lidsuf",
        "email": "example@example.com",
        "hashed_password": "a",
        "account_type": "b",
        "profile_picture": "a",
    },
)

conn.close()
