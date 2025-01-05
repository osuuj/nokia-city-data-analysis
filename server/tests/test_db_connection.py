from server.backend.database import engine


def test_database_connection() -> None:
    try:
        with engine.connect():
            print("Database connection successful!")
    except Exception as e:
        print(f"Database connection failed: {e}")


if __name__ == "__main__":
    test_database_connection()
