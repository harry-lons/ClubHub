from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

from .db_store.postgres import PostgresDatabase

# TODO we need to move away from concrete PostgresDatabase and replace
# by its interface


class DatabaseContainer:
    """This class stores our Databases. We need this as we want to have a `db`
    which is type-hinted as our database object completely (not an Optional). However,
    we also need to wait until it is initalized. Without this, we would need do do db = None,
    then initalize(db), making it impossible to type-hint db as a database"""

    def __init__(self):
        self._database = None
        self._connection = None

    @property
    def db(self) -> PostgresDatabase:
        """Call this property to access our database"""
        if self._database is None:
            raise Exception("Database has not been initalized")
        else:
            return self._database

    @db.setter
    def db(self, database: PostgresDatabase):
        if self._database is not None:
            raise Exception("Database has already been initialized.")
        self._database = database

    @property
    def connection(self):
        if self._connection is None:
            raise Exception("Database has not been initalized")
        else:
            return self._connection

    @connection.setter
    def connection(self, connection):
        if self._connection is not None:
            raise Exception("Database has already been initialized.")
        self._connection = connection

    """
    Creates a Connection Object that allows for the
    execution of Postgres commands
    """

    def connect_db(self, url):
        engine = create_engine(url)
        self.connection = engine.connect()

        Session = sessionmaker(bind=engine)
        session = Session()

        self.db = PostgresDatabase(session=session)


url = URL.create(
    drivername="postgresql+psycopg",
    username="username",
    password="examplepassword",
    host="127.0.0.1",
    port=5432,
    database="SoCalSocial",
)

DB = DatabaseContainer()
