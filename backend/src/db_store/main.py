import os

from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base

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
    username=os.environ["PG_USERNAME"],
    password=os.environ["PG_PASSWORD"],
    host=os.environ["PG_HOST"],
    port=int(os.environ["PG_PORT"]),
    database=os.environ["PG_DATABSE"],
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

db.add_user("username1@example.com", "$argon2id$v=19$m=65536,t=3,p=4$KYUwppQyxjgnBIBQyrkXAg$OmDVsUIY90aOTyvp0kbrtLuSKsSaewP64MfSDEwH7+w", first_name="f", last_name="l")

# db._create(
#     Accounts,
#     {
#         "id": "lidsuf",
#         "email": "example@example.com",
#         "hashed_password": "a",
#         "account_type": "b",
#         "profile_picture": "a",
#     },
# )

print("Testing queries")
print(db.get_user_from_email("username1@example.com"))

# x = db._get_by(Accounts, email="example@example.com")
# print(x.id)

conn.close()
