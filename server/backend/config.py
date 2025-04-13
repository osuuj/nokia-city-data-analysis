"""This module handles the configuration loading and environment variable resolution for the application."""

import os
from pathlib import Path
from typing import List

import yaml
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load .env file
load_dotenv()

# Paths
BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "../config/db.yml"


def load_yaml(file_path: Path) -> dict:
    """Load a YAML file.

    Args:
        file_path (Path): The path to the YAML file.

    Returns:
        dict: The loaded YAML content as a dictionary.

    Raises:
        FileNotFoundError: If the YAML file does not exist.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {file_path}")
    with file_path.open("r", encoding="utf-8") as file:
        return yaml.safe_load(file) or {}


def resolve_env_vars(config: dict) -> dict:
    """Resolve environment variables in the configuration.

    Args:
        config (dict): The configuration dictionary.

    Returns:
        dict: The configuration dictionary with resolved environment variables.
    """
    for key, value in config.items():
        if isinstance(value, str) and value.startswith("${") and value.endswith("}"):
            env_var = value[2:-1]  # Strip ${ and }
            config[key] = os.getenv(env_var, value)
        elif isinstance(value, dict):
            config[key] = resolve_env_vars(value)
    return config


def load_config() -> dict:
    """Load and resolve configuration from YAML and environment variables.

    Returns:
        dict: The resolved configuration dictionary.
    """
    config = load_yaml(CONFIG_PATH)
    return resolve_env_vars(config)


# Load the configuration
CONFIG = load_config()

# Construct the database URL
DATABASE_URL = f"postgresql://{CONFIG['db']['user']}:{CONFIG['db']['password']}@{CONFIG['db']['host']}:{CONFIG['db']['port']}/{CONFIG['db']['name']}"

# Make the config available as 'settings' for import compatibility
settings = CONFIG


class Settings(BaseSettings):
    # Project Settings
    PROJECT_NAME: str = "Nokia City Data API"
    API_V1_STR: str = "/api/v1"

    # Database Configuration (loads from environment variables)
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DB_HOST: str
    DB_PORT: str = "5432"

    # CORS Origins (example: "http://localhost:3000,http://127.0.0.1:3000")
    # Pydantic settings automatically handles comma-separated strings into lists if typed correctly
    BACKEND_CORS_ORIGINS: List[str] = []

    # Construct Database URL
    # Use model_computed_field in Pydantic v2 for cleaner construction
    # Or define as a property
    @property
    def DATABASE_URL(self) -> str:
        """Construct database connection URL."""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.POSTGRES_DB}"

    class Config:
        """Pydantic BaseSettings config."""

        # Optional: Specify .env file if not using load_dotenv separately
        # env_file = ".env"
        case_sensitive = True


# Instantiate the settings
settings = Settings()

# Make DATABASE_URL easily accessible if needed directly elsewhere (though prefer settings.DATABASE_URL)
DATABASE_URL = settings.DATABASE_URL
