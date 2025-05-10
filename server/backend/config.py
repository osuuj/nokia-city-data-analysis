"""Configuration settings for the backend.

This module loads configuration from environment variables and provides
default values for development. For production, override these values
with environment variables.
"""

import os
from typing import List, Optional, Set, Union

from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings  # pyright: ignore[reportMissingImports]


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

    # Database settings
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

    # CORS settings
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

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

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Parse CORS origins into a list.

        Args:
            v: CORS origins string or list

        Returns:
            Parsed CORS origins
        """
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        elif isinstance(v, str):
            # Handle the case when v is a string but might be a JSON list
            return v  # type: ignore
        raise ValueError(v)

    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_connection(cls, v: Optional[str], info) -> PostgresDsn:
        """Assemble database URL if not provided.

        Args:
            v: Database URL
            info: Field validator info

        Returns:
            Database URL
        """
        if isinstance(v, str):
            return PostgresDsn(v)

        values = info.data
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_HOST"),
            port=int(values.get("POSTGRES_PORT")),
            path=f"{values.get('POSTGRES_DB') or ''}",
        )

    class Config:
        """Pydantic model configuration."""

        case_sensitive = True
        env_file = f".env.{os.getenv('ENVIRONMENT', 'dev')}"


settings = Settings()
