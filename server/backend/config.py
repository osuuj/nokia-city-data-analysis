"""Configuration settings for the backend."""

import json
import logging
import os
from typing import Any, List, Optional, Set
from urllib.parse import quote_plus

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Nokia City Data API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "dev")
    DEBUG: bool = ENVIRONMENT == "dev"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    SQLALCHEMY_ECHO: bool = DEBUG

    API_V1_STR: str = "/api/v1"

    # Database settings - we'll override these manually later

    POSTGRES_HOST: str = os.getenv("DB_HOST", os.getenv("POSTGRES_HOST", "localhost"))
    POSTGRES_PORT: str = os.getenv("DB_PORT", os.getenv("POSTGRES_PORT", "5432"))
    POSTGRES_USER: str = os.getenv("DB_USER", os.getenv("POSTGRES_USER", "postgres"))
    POSTGRES_PASSWORD: str = os.getenv(
        "DB_PASS", os.getenv("POSTGRES_PASSWORD", "postgres")
    )
    POSTGRES_DB: str = os.getenv(
        "DATABASE_NAME", os.getenv("POSTGRES_DB", "nokia_city_data")
    )
    DATABASE_URL: Optional[PostgresDsn] = None
    DB_SSL_MODE: str = os.getenv("DB_SSL_MODE", "require")  # Use "require" in prod

    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "20"))
    DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "10"))
    DB_POOL_TIMEOUT: int = int(os.getenv("DB_POOL_TIMEOUT", "30"))
    DB_POOL_RECYCLE: int = int(os.getenv("DB_POOL_RECYCLE", "1800"))

    JWT_SECRET_KEY: Optional[str] = None
    JWT_ALGORITHM: Optional[str] = None
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: Optional[int] = None

    BACKEND_CORS_ORIGINS: Any = None

    ANALYTICS_PRIORITY_INDUSTRIES: Set[str] = {"K", "L", "R", "G", "C", "Q"}
    ANALYTICS_OTHER_CATEGORY_NAME: str = "Other"
    ANALYTICS_TOP_N_INDUSTRIES: int = 10

    CACHE_TTL_SHORT: int = 300
    CACHE_TTL_MEDIUM: int = 3600
    CACHE_TTL_LONG: int = 86400

    RATE_LIMIT_DEFAULT: str = "60/minute"
    RATE_LIMIT_HEAVY: str = "20/minute"
    RATE_LIMIT_HEALTH: str = "120/minute"

    model_config = SettingsConfigDict(
        env_nested_delimiter=None,
        env_file=None,
        env_prefix="",
        extra="ignore",
        frozen=False,
    )

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def set_cors_origins(cls, v: Any) -> List[str]:
        """Validate and set the CORS origins for the backend."""
        is_production = os.environ.get("ENVIRONMENT", "dev") == "production"
        origins_str = os.getenv("BACKEND_CORS_ORIGINS")

        if is_production and not origins_str:
            logging.critical(
                "SECURITY RISK: BACKEND_CORS_ORIGINS not set in production"
            )
            return ["https://osuuj.ai"]

        origins_str = origins_str or "http://localhost:3000,http://localhost:8000"

        try:
            # Try parsing as JSON list
            parsed = json.loads(origins_str)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass

        # Fallback to comma-split
        return [origin.strip() for origin in origins_str.split(",")]

    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_connection(cls, v: Optional[str], info) -> str:
        """Assemble the full database URL from environment or secrets."""
        # Get values from info data
        values = info.data

        # Get host and port from environment variables (required)
        host = os.environ.get("POSTGRES_HOST")
        if not host:
            raise ValueError("POSTGRES_HOST environment variable is required")

        port = os.environ.get("POSTGRES_PORT")
        if not port:
            raise ValueError("POSTGRES_PORT environment variable is required")

        # Get database name from environment
        db_name = os.environ.get("POSTGRES_DB", "nokia_city_data")

        # Get username and password from DATABASE_CREDENTIALS in production
        if os.environ.get("ENVIRONMENT", "dev") == "production":
            try:
                if "DATABASE_CREDENTIALS" in os.environ:
                    db_credentials = json.loads(
                        os.environ.get("DATABASE_CREDENTIALS", "{}")
                    )
                    username = db_credentials.get("username")
                    password = quote_plus(db_credentials.get("password", ""))
                else:
                    raise ValueError(
                        "DATABASE_CREDENTIALS environment variable is required in production"
                    )
            except Exception as e:
                logging.error(f"Error parsing DATABASE_CREDENTIALS: {e}")
                raise
        else:
            # Development: use environment variables
            username = values.get("POSTGRES_USER")
            password = quote_plus(values.get("POSTGRES_PASSWORD", ""))

        # Build connection string WITHOUT sslmode in the URL
        # SSL will be configured at engine creation time
        result = f"postgresql+asyncpg://{username}:{password}@{host}:{port}/{db_name}"
        logging.info(f"Built connection string: {result.replace(password, '********')}")
        return result


# Instantiate settings globally
settings = Settings()

# Print final DATABASE_URL (with password masked)
db_url = str(settings.DATABASE_URL)
masked_url = db_url
if ":" in db_url and "@" in db_url:
    # Very basic masking - won't work for all URL formats but should catch most
    parts = db_url.split("@")
    if len(parts) >= 2:
        creds = parts[0].split(":")
        if len(creds) >= 3:  # protocol:user:pass
            masked_url = f"{creds[0]}:{creds[1]}:********@{parts[1]}"

print(f"🔌 Final DATABASE_URL: {masked_url}")
if "sslmode" in db_url:
    print("⚠️ WARNING: Final DATABASE_URL contains 'sslmode'!")

# Ensure fallback for CORS
if not settings.BACKEND_CORS_ORIGINS:
    settings.BACKEND_CORS_ORIGINS = ["http://localhost:3000"]
