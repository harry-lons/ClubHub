from fastapi import FastAPI

from .authentication.service import app as auth_router
from .events.service import app as event_router
from .identities.service import app as identities_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(event_router)
app.include_router(identities_router)
