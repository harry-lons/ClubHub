from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .authentication.service import app as auth_router
from .events.service import app as event_router
from .identities.service import app as identities_router

app = FastAPI()
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
