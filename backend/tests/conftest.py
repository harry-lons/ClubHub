import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, func, text
from sqlalchemy.orm import sessionmaker

from src.app import app
from src.database import DB
from src.db_store.models import Events, EventTagAssociations


@pytest.fixture(scope="session")
def base_client():
    print("Starting API...")
    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="function")
def client(base_client):
    """
    New fixture that uses the session-scoped 'client' fixture but adds logic
    to reset the database before each test.
    We DO NOT initalize the database with test data in this function. We should have
    ran the script in db_store/main.py to do that before running tests
    DO NOT call session.commit() in functions, or else this will not work.
    """
    old_session = DB.db.session
    old_session.close()

    conn = DB.connection
    Session = sessionmaker(bind=conn)
    new_session = Session()  # Create a session using this connection

    # Begin a transaction at the connection level
    conn.begin()

    # Optionally, you can also start a nested transaction here if needed
    # nested_transaction = session.begin_nested()  # For savepoint support

    DB.db.session = new_session

    yield base_client

    print("Rolling back transaction at the connection level...")
    conn.rollback()

    new_session.close()
    next_session = sessionmaker(bind=conn)()
    DB.db.session = next_session  # reset DB.db.session if needed

    # Reset the autoincrement sequences (If we inserted something and it got id 2, then the next
    # one would be 3, despite us reverting the changes)
    sequence_name = f"{Events.__tablename__}_id_seq"
    max_id = next_session.query(func.max(Events.id)).scalar() or 0
    conn.execute(text(f"SELECT setval('{sequence_name}', {max_id + 1}, false)"))
