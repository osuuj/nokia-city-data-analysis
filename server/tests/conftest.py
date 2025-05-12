"""Test configuration and shared fixtures."""

import asyncio
from typing import AsyncGenerator

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from server.backend.config import settings
from server.backend.database import get_db
from server.backend.main import app

# Use a separate test database
# Convert PostgresDsn to string first before manipulating it
DATABASE_URL_STR = str(settings.DATABASE_URL)
TEST_DATABASE_URL = DATABASE_URL_STR.replace(
    "postgresql+asyncpg://", "postgresql+asyncpg://", 1
)

# Ensure we're using a test database
if "test" not in TEST_DATABASE_URL and "memory" not in TEST_DATABASE_URL:
    # Handle the possibility that POSTGRES_DB is not a string attribute
    db_name = (
        settings.POSTGRES_DB
        if isinstance(settings.POSTGRES_DB, str)
        else str(settings.POSTGRES_DB)
    )
    TEST_DATABASE_URL = TEST_DATABASE_URL.replace(db_name, f"{db_name}_test")

# Create the engine and session for tests
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


# Override the get_db dependency
async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    """Get a test database session."""
    async with TestingSessionLocal() as session:
        yield session


# Apply the override
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db():
    """Create a fresh database for testing."""
    # Get a clean connection for each test
    async with TestingSessionLocal() as session:
        try:
            yield session
        finally:
            # Explicitly close the session
            await session.close()
