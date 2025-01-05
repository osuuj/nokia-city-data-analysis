"""This module contains a test function to check the database connection."""

from server.backend.database import engine


def test_database_connection() -> None:
    """Test the database connection.

    Tries to connect to the database and prints the result.

    Raises:
        Exception: If the database connection fails.
    """
    try:
        with engine.connect():
            print("Database connection successful!")
    except Exception as e:
        print(f"Database connection failed: {e}")


if __name__ == "__main__":
    test_database_connection()
