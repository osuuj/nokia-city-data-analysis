"""This module handles the database connection setup and provides a session generator for database operations."""

from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from server.backend.config import DATABASE_URL

# Database connection setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Generate a database session for use in database operations.

    Yields:
        Generator[Session, None, None]: A SQLAlchemy Session object.

    Ensures:
        The session is closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
