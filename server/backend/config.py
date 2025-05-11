"""Configuration settings for the backend.

This module loads configuration from environment variables and provides
default values for development. For production, override these values
with environment variables.
"""

import json
import os
from typing import Any, List, Optional, Set

from pydantic import PostgresDsn, field_validator
from pydantic_settings import (  # pyright: ignore[reportMissingImports]
    BaseSettings,
    SettingsConfigDict,
)


# Create a completely environment-free settings class
class Settings(BaseSettings):
    """Application settings.

    These settings are loaded from environment variables. Default values
    are provided for development, but should be overridden in production.
    """

    # Basic application settings
    PROJECT_NAME: str = "Nokia City Data API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "dev")
    DEBUG: bool = ENVIRONMENT == "dev"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    SQLALCHEMY_ECHO: bool = DEBUG

    # API settings
    API_V1_STR: str = "/api/v1"

    # Database settings - we'll override these manually later
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "nokia_city_data")
    DATABASE_URL: Optional[PostgresDsn] = None

    # Database pool settings
    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "20"))  # Production default
    DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "10"))
    DB_POOL_TIMEOUT: int = int(os.getenv("DB_POOL_TIMEOUT", "30"))
    DB_POOL_RECYCLE: int = int(os.getenv("DB_POOL_RECYCLE", "1800"))  # 30 minutes

    # Security settings - JWT not implemented yet but ready when needed
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY", "placeholder_jwt_secret_key_for_dev_only"
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS settings - Hard-coded for local development
    # Define as Any to avoid validation, but override with field_validator
    BACKEND_CORS_ORIGINS: Any = None

    # Analytics settings
    ANALYTICS_PRIORITY_INDUSTRIES: Set[str] = {
        "K",  # IT
        "L",  # Finance
        "R",  # Healthcare
        "G",  # Retail
        "C",  # Manufacturing
        "Q",  # Education
    }
    ANALYTICS_OTHER_CATEGORY_NAME: str = "Other"
    ANALYTICS_TOP_N_INDUSTRIES: int = 10

    # Cache settings
    CACHE_TTL_SHORT: int = 300  # 5 minutes
    CACHE_TTL_MEDIUM: int = 3600  # 1 hour
    CACHE_TTL_LONG: int = 86400  # 24 hours

    # Rate limiting settings
    RATE_LIMIT_DEFAULT: str = "60/minute"
    RATE_LIMIT_HEAVY: str = "20/minute"
    RATE_LIMIT_HEALTH: str = "120/minute"

    # CRITICAL: Completely disable environment variables and .env files
    model_config = SettingsConfigDict(
        env_nested_delimiter=None,  # Disable nested env vars
        env_file=None,  # Disable .env file loading
        env_prefix="",  # Use empty string instead of None
        extra="ignore",  # Ignore extra attributes
        frozen=False,  # Allow changes after init
    )

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def set_cors_origins(cls, v: Any) -> List[str]:
        """Completely override any value with a fixed list.

        Args:
            v: Any input value (ignored)

        Returns:
            Fixed list of allowed origins
        """
        # Parse environment variable if provided, otherwise use default
        origins_str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000")
        origins = [origin.strip() for origin in origins_str.split(",")]
        return origins

    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_connection(cls, v: Optional[str], info) -> PostgresDsn:
        """Assemble database URL if not provided.

        Args:
            v: Database URL
            info: Field validator info

        Returns:
            Database URL
        """
        # If explicit DATABASE_URL is provided, use it
        if isinstance(v, str):
            return PostgresDsn(v)

        # For production environment with AWS Secrets
        if os.environ.get("ENVIRONMENT", "dev") == "production":
            try:
                # Get credentials from AWS Secrets Manager (auto-loaded to environment)
                if "DATABASE_CREDENTIALS" in os.environ:
                    db_credentials = json.loads(
                        os.environ.get("DATABASE_CREDENTIALS", "{}")
                    )
                    db_name = os.environ.get("DATABASE_NAME", "nokia_city_data")

                    # Build connection string from credentials
                    return PostgresDsn.build(
                        scheme="postgresql+asyncpg",
                        username=db_credentials.get("username"),
                        password=db_credentials.get("password"),
                        host=db_credentials.get("host"),
                        port=int(db_credentials.get("port", 5432)),
                        path=f"{db_name}",
                    )
            except Exception as e:
                print(f"Error loading AWS Secrets: {e}")
                # Fall through to default handling

        # Default behavior using individual environment variables
        values = info.data
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_HOST"),
            port=int(values.get("POSTGRES_PORT")),
            path=f"{values.get('POSTGRES_DB') or ''}",
        )


# Create settings instance with default values
settings = Settings()

# Force set BACKEND_CORS_ORIGINS after initialization if not set from environment
if not settings.BACKEND_CORS_ORIGINS:
    settings.BACKEND_CORS_ORIGINS = ["http://localhost:3000"]
