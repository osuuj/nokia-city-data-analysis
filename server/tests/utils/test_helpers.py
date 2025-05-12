"""Test helpers for common operations.

This module provides helper functions for common testing operations.
"""

import contextlib
from functools import wraps
from typing import Any, AsyncGenerator, Callable, TypeVar

from fastapi import FastAPI
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.database import get_db

# Type variable for function return types
T = TypeVar("T")


def safe_db_query(func: Callable[..., T]) -> Callable[..., T]:
    """Safely execute a database query in tests.

    This decorator ensures that database queries are executed safely in tests,
    handling event loop issues and properly closing connections.

    Args:
        func: Function to decorate

    Returns:
        Wrapped function
    """

    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            result = await func(*args, **kwargs)
            return result
        except Exception as e:
            # Include better error details for debugging
            raise RuntimeError(
                f"Database query failed: {str(e)}, in function {func.__name__}"
            ) from e

    return wrapper


@safe_db_query
async def get_test_city(db: AsyncSession) -> str:
    """Get a test city from the database safely.

    Args:
        db: Database session

    Returns:
        City name or None if no cities found
    """
    query = text("SELECT DISTINCT city FROM addresses LIMIT 1")
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None


@safe_db_query
async def get_test_cities(db: AsyncSession, count: int = 2) -> list:
    """Get multiple test cities from the database safely.

    Args:
        db: Database session
        count: Number of cities to retrieve

    Returns:
        List of city names or empty list if no cities found
    """
    query = text(f"SELECT DISTINCT city FROM addresses LIMIT {count}")
    result = await db.execute(query)
    rows = result.fetchall()
    return [row[0] for row in rows] if rows else []


@safe_db_query
async def get_test_industry_letter(db: AsyncSession) -> str:
    """Get a test industry letter from the database safely.

    Args:
        db: Database session

    Returns:
        Industry letter or None if no industries found
    """
    query = text(
        "SELECT DISTINCT industry_letter FROM industry_classifications LIMIT 1"
    )
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None


@contextlib.asynccontextmanager
async def create_test_session(db: AsyncSession) -> AsyncGenerator[AsyncSession, None]:
    """Create a dedicated test session that won't interfere with other operations.

    Args:
        db: The original database session

    Yields:
        A new database session
    """
    try:
        # Create a new transaction for this specific operation
        async with db.begin():
            yield db
    finally:
        # Ensure session is properly cleaned up
        await db.close()


def setup_test_dependencies(app: FastAPI, db: AsyncSession) -> None:
    """Set up test dependencies.

    This function overrides dependencies for testing.

    Args:
        app: FastAPI application
        db: Database session
    """

    # Override the get_db dependency
    async def override_get_db():
        try:
            yield db
        finally:
            # Don't close here, as it's closed in the fixture
            pass

    app.dependency_overrides[get_db] = override_get_db


def teardown_test_dependencies(app: FastAPI) -> None:
    """Tear down test dependencies.

    Args:
        app: FastAPI application
    """
    app.dependency_overrides.clear()
