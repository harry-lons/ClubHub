from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .authentication.service import app as auth_router
from .events.service import app as event_router
from .identities.service import app as identities_router

from .db_store.models import *
from .db_store.postgres import PostgresDatabase
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

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

Session = sessionmaker(bind=engine)
session = Session()

@contextmanager
def start_db(app: FastAPI):
    db = PostgresDatabase(session=session)
    yield
    print("Closing databse connection")

app = FastAPI(lifespan=start_db)
app.include_router(auth_router)
app.include_router(event_router)
app.include_router(identities_router)

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
