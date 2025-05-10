"""Database initialization script.

This script initializes the database with the schema from schema.sql.
"""

import logging
from pathlib import Path

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

logger = logging.getLogger(__name__)

# Path to schema file
SCHEMA_FILE = Path(__file__).parent / "schema.sql"


async def init_db(engine: AsyncEngine) -> None:
    """Initialize the database with the schema.

    Args:
        engine: SQLAlchemy async engine
    """
    if not SCHEMA_FILE.exists():
        logger.warning(f"Schema file not found at {SCHEMA_FILE}")
        return

    logger.info("Initializing database with schema")

    try:
        # Read schema SQL
        schema_sql = SCHEMA_FILE.read_text()

        # Execute schema SQL to create tables and indexes
        async with engine.begin() as conn:
            await conn.execute(text(schema_sql))

        logger.info("Database schema initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database schema: {e}")
        raise
