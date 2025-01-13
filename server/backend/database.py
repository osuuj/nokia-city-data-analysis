"""This module handles the database connection setup and provides a session generator for database operations.

- Integrates with SQLAlchemy to define the database engine and session.
- Uses declarative base for defining ORM models.
- Ensures proper session lifecycle management using context managers.

"""

from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from server.backend.config import DATABASE_URL

# Database connection setup
engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Generate a database session for use in database operations.

    Yields:
        sqlalchemy.orm.Session: A SQLAlchemy session object.

    Ensures:
        The session is closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
