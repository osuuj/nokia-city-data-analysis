"""Test configuration and shared fixtures."""

import asyncio
import os
import random
import string

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

# Add a unique identifier to prevent test interference when running in parallel
# Skip this in GitHub Actions environment to avoid db name mismatch
if not os.getenv("GITHUB_ACTIONS"):
    random_suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
    TEST_DATABASE_URL = TEST_DATABASE_URL.replace("testdb", f"testdb_{random_suffix}")

# Create a dedicated test engine with specific settings for tests
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
    isolation_level="AUTOCOMMIT",  # Important for test transactions
)

TestingSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for async tests."""
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db():
    """Create a fresh database session for each test function."""
    # Create a new session for each test
    session = TestingSessionLocal()

    # Override the get_db dependency to use our test session
    async def override_get_db():
        try:
            # Use the same session for the entire test
            yield session
        except Exception as e:
            await session.rollback()
            raise e

    # Apply the override
    app.dependency_overrides[get_db] = override_get_db

    try:
        yield session
    finally:
        # Clean up after the test
        app.dependency_overrides.clear()
        await session.close()
