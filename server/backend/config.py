"""Configuration settings for the backend."""

import json
import logging
import os
from typing import Any, List, Optional, Set

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

    # DB settings (accept both DB_* and POSTGRES_* for compatibility)
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
        return [origin.strip() for origin in origins_str.split(",")]

    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_connection(cls, v: Optional[str], info) -> PostgresDsn:
        """Assemble the database connection string as a Postgres DSN."""
        if isinstance(v, str):
            return PostgresDsn(v)

        # Check if AWS Secrets Manager injected credentials into a single JSON var
        if os.environ.get("ENVIRONMENT", "dev") == "production":
            try:
                if "DATABASE_CREDENTIALS" in os.environ:
                    db_credentials = json.loads(os.environ["DATABASE_CREDENTIALS"])
                    db_name = os.environ.get("DATABASE_NAME", "nokia_city_data")
                    return PostgresDsn.build(
                        scheme="postgresql+asyncpg",
                        username=db_credentials.get("username"),
                        password=db_credentials.get("password"),
                        host=db_credentials.get("host"),
                        port=int(db_credentials.get("port", 5432)),
                        path=f"/{db_name}",
                        query={"sslmode": "require"},
                    )
            except Exception as e:
                print(f"Error loading DATABASE_CREDENTIALS: {e}")

        # Default to individual env vars
        values = info.data
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_HOST"),
            port=int(values.get("POSTGRES_PORT")),
            path=f"/{values.get('POSTGRES_DB')}",
            query={"sslmode": "require"},
        )


# Instantiate settings globally
settings = Settings()

# Ensure fallback for CORS
if not settings.BACKEND_CORS_ORIGINS:
    settings.BACKEND_CORS_ORIGINS = ["http://localhost:3000"]
