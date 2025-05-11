"""Database initialization script.

This script initializes the database with the schema from schema.sql.
"""

import logging
import os
from pathlib import Path

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

logger = logging.getLogger(__name__)

# Try different paths to find the schema file
base_paths = [
    # Standard path relative to this file
    Path(__file__).parent / "schema.sql",
    # Docker container path
    Path("/app/db/schema.sql"),
    # Server directory path
    Path(__file__).parent.parent.parent / "db" / "schema.sql",
]

# Find the first valid schema file path
SCHEMA_FILE = None
for path in base_paths:
    if path.exists():
        SCHEMA_FILE = path
        break


async def init_db(engine: AsyncEngine) -> None:
    """Initialize the database with the schema.

    Args:
        engine: SQLAlchemy async engine
    """
    if not SCHEMA_FILE:
        logger.error("Schema file not found in any of the expected locations")
        logger.error(f"Searched paths: {[str(p) for p in base_paths]}")
        logger.error(f"Current working directory: {os.getcwd()}")
        raise FileNotFoundError("Schema file not found")

    logger.info(f"Initializing database with schema from {SCHEMA_FILE}")

    try:
        # Read schema SQL
        schema_sql = SCHEMA_FILE.read_text()

        # Split SQL into individual statements
        # Split on semicolons but not inside string literals
        sql_statements = []
        current_statement = ""
        for line in schema_sql.splitlines():
            # Skip empty lines and comments
            stripped = line.strip()
            if not stripped or stripped.startswith("--"):
                continue

            current_statement += line + "\n"
            if ";" in line:
                sql_statements.append(current_statement)
                current_statement = ""

        # Add the last statement if it doesn't end with semicolon
        if current_statement.strip():
            sql_statements.append(current_statement)

        # Execute each SQL statement separately
        async with engine.begin() as conn:
            for statement in sql_statements:
                if statement.strip():  # Skip empty statements
                    await conn.execute(text(statement))

        logger.info("Database schema initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database schema: {e}")
        raise
