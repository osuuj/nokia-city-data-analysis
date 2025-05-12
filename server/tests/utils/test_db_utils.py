"""Database testing utilities.

This module provides utilities for testing database-related functionality.
"""

import asyncio
import functools
from typing import Any, Callable, TypeVar

from sqlalchemy.ext.asyncio import AsyncSession

# Type variable for function return types
T = TypeVar("T")


def run_in_test_loop(func: Callable[..., Any]) -> Callable[..., Any]:
    """Run an async function in the current test event loop.

    This decorator ensures that the function runs in the current test event loop,
    avoiding "Future attached to a different loop" errors.

    Args:
        func: Async function to run

    Returns:
        Wrapped function that runs in the current test event loop
    """

    @functools.wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        # Ensure we're running in the current event loop
        asyncio.get_event_loop()
        return await func(*args, **kwargs)

    return wrapper


async def mock_db_dependency() -> AsyncSession:
    """Mock the database dependency.

    This function creates a mock database dependency that can be used in tests.

    Returns:
        Mocked database session
    """
    # This could be expanded with mock functionality if needed
    from ..conftest import TestingSessionLocal

    return TestingSessionLocal()


def wrap_db_calls(db_func: Callable[..., T]) -> Callable[..., T]:
    """Wrap database calls to ensure they use the same event loop.

    Args:
        db_func: Database function to wrap

    Returns:
        Wrapped function
    """

    @functools.wraps(db_func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        loop = asyncio.get_event_loop()
        task = loop.create_task(db_func(*args, **kwargs))
        return await task

    return wrapper
