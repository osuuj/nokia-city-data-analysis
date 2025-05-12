"""Test configuration and shared fixtures."""

import asyncio
import os
import random
import string

import pytest
from sqlalchemy import text
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

# Skip this in GitHub Actions environment to avoid db name mismatch
if not os.getenv("GITHUB_ACTIONS"):
    random_suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
    TEST_DATABASE_URL = TEST_DATABASE_URL.replace("testdb", f"testdb_{random_suffix}")

# Create a dedicated test engine with specific settings for tests
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    pool_size=20,  # Increased pool size
    max_overflow=20,  # Increased max overflow
    pool_pre_ping=True,
    pool_recycle=300,
    isolation_level="READ COMMITTED",  # Changed from AUTOCOMMIT
)

TestingSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def verify_test_database():
    """Verify that the test database is properly set up."""
    if os.getenv("GITHUB_ACTIONS"):
        print(f"Using database URL: {TEST_DATABASE_URL}")
        session = TestingSessionLocal()
        try:
            # Check if the businesses table exists and has data
            result = await session.execute(text("SELECT COUNT(*) FROM businesses"))
            count = result.scalar()
            print(f"Found {count} businesses in the test database")
            if count == 0:
                pytest.fail("Test database is empty. Check your database setup.")
        except Exception as e:
            pytest.fail(f"Test database verification failed: {str(e)}")
        finally:
            await session.close()


# Override get_db for all tests globally
@pytest.fixture(autouse=True)
def override_dependency():
    async def _temp_get_db():
        # This will be replaced by the db fixture in each test
        pass

    app.dependency_overrides[get_db] = _temp_get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture
async def db():
    """Create a fresh database session for each test function.

    This is a direct session object, not a generator.
    """
    session = TestingSessionLocal()

    # Override the dependency for this test
    async def _get_db_override():
        yield session

    app.dependency_overrides[get_db] = _get_db_override

    try:
        # Return the actual session object
        return session
    finally:
        await session.close()
