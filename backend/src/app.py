from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .authentication.service import app as auth_router
from .database import DB, DatabaseContainer, url
from .db_store.models import *
from .db_store.postgres import PostgresDatabase
from .events.service import app as event_router
from .identities.service import app as identities_router


@asynccontextmanager
async def start_db(app: FastAPI):
    print("Connecting to database...")
    DB.connect_db(url)
    yield
    print("Closing databse connection...")


app = FastAPI(lifespan=start_db)
app.include_router(auth_router)
app.include_router(event_router)
app.include_router(identities_router)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    #allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

