"""Database connection and session management.

This module handles the creation of database connections, session management,
and the creation of database tables.
"""

import logging
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

# Check for sslmode in URL
if "sslmode=" in db_url:
    logger.warning(
        "Found 'sslmode=' in DATABASE_URL, this may cause issues with asyncpg"
    )
    # Remove sslmode from URL
    db_url_parts = db_url.split("?")
    if len(db_url_parts) > 1:
        base_url = db_url_parts[0]
        query_parts = db_url_parts[1].split("&")
        new_query_parts = [p for p in query_parts if not p.startswith("sslmode=")]
        db_url = base_url
        if new_query_parts:
            db_url += "?" + "&".join(new_query_parts)
        logger.info(f"Removed sslmode from URL: {db_url}")

# SSL configuration for asyncpg connection
ssl_mode = "require" if settings.ENVIRONMENT == "production" else settings.DB_SSL_MODE
connect_args: Dict[str, Any] = {}

# Configure SSL for PostgreSQL
if ssl_mode in ("require", "verify-ca", "verify-full"):
    connect_args["ssl"] = True
    logger.info(f"SSL enabled with mode: {ssl_mode}")

# Create the SQLAlchemy engine with SSL settings
engine = create_async_engine(
    db_url,  # Use modified URL without sslmode
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
        # Only create tables that don't exist
        # This is done via init_db now with the schema.sql file
        # async with engine.begin() as conn:
        #     await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables verified")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Get a database session.

    Yields:
        AsyncSession: Database session
    """
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
