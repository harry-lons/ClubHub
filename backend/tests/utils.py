# import pytest
# from fastapi.testclient import TestClient
# from sqlalchemy import MetaData
# from sqlalchemy.orm import Session

# from src.app import app
# from src.db_store.postgres import PostgresDatabase


# @pytest.fixture(scope="session")
# def client():
#     # TODO setup and delete tables and data to allow tests to be independent
#     print("Setting up Database for tests...")
#     with TestClient(app) as client:
#         yield client


# def reset_database(session: Session):
#     """Deletes all tables in the database"""

#     # https://stackoverflow.com/questions/74755722/confused-between-engine-metadata-base-and-sessions-sqlalchemy-exc-unboundexecu

#     engine = session.get_bind()

#     metadata = MetaData()

#     for table in metadata.sorted_tables:
#         session
