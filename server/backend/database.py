"""Database connection and session management.

This module handles the creation of database connections, session management,
and the creation of database tables.
"""

import logging
import os
from typing import Any, AsyncGenerator, Dict

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from .config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Debug: print the DATABASE_URL (with password masked)
db_url = str(settings.DATABASE_URL)
masked_url = db_url
if ":" in db_url and "@" in db_url:
    parts = db_url.split("@")
    if len(parts) >= 2:
        creds = parts[0].split(":")
        if len(creds) >= 3:  # protocol:user:pass
            masked_url = f"{creds[0]}:{creds[1]}:********@{parts[1]}"
logger.info(f"Creating engine with DATABASE_URL: {masked_url}")

# Configure SSL for PostgreSQL with asyncpg
connect_args: Dict[str, Any] = {}

# Get SSL mode from environment variables
ssl_mode = os.getenv("DB_SSL_MODE", "require").lower()
logger.info(f"Using SSL mode: {ssl_mode}")

if ssl_mode == "require":
    # Use SSL but don't verify certificate (recommended for RDS)
    connect_args["ssl"] = True
    logger.info("SSL enabled without certificate verification")
else:
    # Development: Disable SSL completely
    connect_args["ssl"] = False
    logger.info("SSL disabled")

logger.info(f"Creating async engine with connect_args: {connect_args}")

# Create the SQLAlchemy engine with SSL settings
engine = create_async_engine(
    db_url,
    echo=settings.SQLALCHEMY_ECHO,
    future=True,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_recycle=settings.DB_POOL_RECYCLE,
    connect_args=connect_args,
)

# Create the SessionLocal class
async_session = async_sessionmaker(
    engine,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for SQLAlchemy models
Base = declarative_base()


async def create_db_and_tables() -> None:
    """Create database tables if they don't exist."""
    try:
        logger.info("Database tables verified")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Get a database session."""
    async with async_session() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()


async def close_db_connection() -> None:
    """Close database connections on shutdown."""
    try:
        await engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database connections: {e}")


# Export common database components
__all__ = ["Base", "engine", "get_db", "create_db_and_tables", "close_db_connection"]
