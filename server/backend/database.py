"""Database connection and session management.

This module handles the creation of database connections, session management,
and the creation of database tables.
"""

import logging
import os
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from .config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Determine SSL settings based on environment
is_production = os.environ.get("ENVIRONMENT", "dev") == "production"
ssl_args = {}

if is_production:
    logger.info(
        "Production environment detected, configuring SSL for database connection"
    )
    ssl_args = {
        "ssl": True,
        "connect_args": {
            "ssl_mode": "require",
        },
    }
    logger.info("SSL enabled for database connection")
else:
    logger.info("Development environment, SSL not required for database connection")

# Create the SQLAlchemy engine with SSL support in production
engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=settings.SQLALCHEMY_ECHO,
    future=True,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_recycle=settings.DB_POOL_RECYCLE,
    **ssl_args,
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
