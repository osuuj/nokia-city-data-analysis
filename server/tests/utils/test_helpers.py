"""Test helpers for common operations.

This module provides helper functions for common testing operations.
"""

from functools import wraps
from typing import Any, Callable, TypeVar

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
            # Debug info
            import inspect

            print(f"Calling {func.__name__} with session type: {type(args[0])}")
            if inspect.isgenerator(args[0]) or inspect.isasyncgen(args[0]):
                print(f"WARNING: Session is a generator in {func.__name__}")

            result = await func(*args, **kwargs)
            return result
        except Exception as e:
            # Include better error details for debugging
            print(f"ERROR in {func.__name__}: {str(e)}")
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
    # Debug info
    print(f"Executing query with session type: {type(db)}")

    try:
        query = text("SELECT DISTINCT city FROM addresses LIMIT 1")
        result = await db.execute(query)
        row = result.first()
        return row[0] if row else None
    except AttributeError as e:
        # If db is a generator, try to get the actual session
        if hasattr(db, "__anext__"):
            print("Detected async generator, trying to get actual session")
            real_db = await db.__anext__()
            query = text("SELECT DISTINCT city FROM addresses LIMIT 1")
            result = await real_db.execute(query)
            row = result.first()
            return row[0] if row else None
        else:
            raise e


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


# Simple function that doesn't use a context manager
async def get_data_safely(db: AsyncSession):
    """Simple wrapper to get data safely without a context manager.

    Args:
        db: Database session

    Returns:
        Tuple with (city, cities)
    """
    city = await get_test_city(db)
    cities = await get_test_cities(db, 2)
    return city, cities


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
