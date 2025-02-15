"""This module handles the database connection setup and provides a session generator for database operations.

- Integrates with SQLAlchemy to define the database engine and session.
- Uses declarative base for defining ORM models.
- Ensures proper session lifecycle management using context managers.

"""

from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from server.backend.config import DATABASE_URL

# ✅ Enable connection pooling
engine = create_engine(
    DATABASE_URL, pool_size=10, max_overflow=5, pool_timeout=30, pool_recycle=1800
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Provides a database session with connection pooling.

    Yields:
        Session: A database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  # ✅ Returns connection to the pool instead of closing it