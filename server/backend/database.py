from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from server.backend.config import DATABASE_URL

# Database connection setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
