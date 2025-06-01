"""Database connection and session management.

This module handles the creation of database connections, session management,
and the creation of database tables.
"""

import logging
import ssl
from pathlib import Path
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

# ✅ Secure and flexible SSL handling
if settings.ENVIRONMENT == "production":
    # Production: Use strict SSL with RDS certificate
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = True
    ssl_ctx.verify_mode = ssl.CERT_REQUIRED

    # Try different paths for the RDS certificate
    cert_paths = [
        Path("/app/certs/rds-ca.pem"),  # Docker container path
        Path("server/certs/rds-ca.pem"),  # Local development path
        Path(__file__).parent.parent.parent
        / "certs"
        / "rds-ca.pem",  # Relative to this file
    ]

    # Find the first valid certificate path
    cert_path = None
    for path in cert_paths:
        if path.exists():
            cert_path = path
            break

    if cert_path:
        ssl_ctx.load_verify_locations(cafile=str(cert_path))
        logger.info(f"SSL enabled with CERT_REQUIRED using certificate at {cert_path}")
    else:
        logger.warning("RDS certificate not found in any of the expected locations")
        logger.warning(f"Searched paths: {[str(p) for p in cert_paths]}")
        # Fall back to system certificates
        logger.info("Falling back to system certificates")

    connect_args["ssl"] = ssl_ctx
else:
    # Development: Disable SSL completely
    connect_args["ssl"] = False
    logger.info("SSL disabled for development environment")

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
