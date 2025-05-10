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
TEST_DATABASE_URL = settings.DATABASE_URL.replace(
    "postgresql+asyncpg://", "postgresql+asyncpg://", 1
)
if "test" not in TEST_DATABASE_URL and "memory" not in TEST_DATABASE_URL:
    TEST_DATABASE_URL = TEST_DATABASE_URL.replace(
        settings.POSTGRES_DB, f"{settings.POSTGRES_DB}_test"
    )


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


@pytest.fixture(scope="session")
async def db():
    """Create a fresh database for testing."""
    # For a real test, we would set up the schema in an empty test DB
    # Here we'll just use the existing database but with a test session
    async with TestingSessionLocal() as session:
        yield session
