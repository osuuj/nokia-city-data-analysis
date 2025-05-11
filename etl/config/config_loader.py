"""Configuration Loader.

This module centralizes the loading, merging, and management of configurations
for the ETL pipeline. It handles multiple YAML configuration files, resolves
environment variables, and constructs runtime settings, including the database
connection URL.
"""

import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml
from dotenv import find_dotenv, load_dotenv

# Load environment variables from multiple possible locations
ENV_FILE = find_dotenv(usecwd=True)
env_path = None  # Initialize env_path to prevent "possibly unbound" error

if ENV_FILE:
    load_dotenv(ENV_FILE)
else:
    # Try the dedicated ETL .env file
    etl_env = Path(__file__).parent.parent / ".env"
    if etl_env.exists():
        load_dotenv(etl_env)
    # Also try root project .env and .env.compose files
    project_root = Path(__file__).parent.parent.parent
    for env_file in [".env", ".env.compose"]:
        env_path = project_root / env_file
        if env_path.exists():
            load_dotenv(env_path)
            break

    # Log the loaded env file
    logger = logging.getLogger(__name__)
    logger.debug(f"Loaded environment variables from {ENV_FILE or etl_env or env_path}")

# Logger setup
logger = logging.getLogger(__name__)

# Constants
DEFAULT_ENV = "development"
DEFAULT_CONFIG_FILES = ["directory.yml", "etl.yml", "entities.yml"]


def load_yaml(file_path: Path) -> Dict[str, Any]:
    """Load a YAML file.

    Args:
        file_path (Path): Path to the YAML file.

    Returns:
        Dict[str, Any]: Parsed YAML content.

    Raises:
        FileNotFoundError: If the file does not exist.
        yaml.YAMLError: If the YAML file is invalid.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {file_path}")

    try:
        with file_path.open("r", encoding="utf-8") as file:
            return yaml.safe_load(file) or {}
    except yaml.YAMLError as e:
        logger.error(f"Invalid YAML in {file_path}: {e}")
        raise


def resolve_env_vars(config: Dict[str, Any]) -> Dict[str, Any]:
    """Resolve environment variables in the configuration.

    Args:
        config (Dict[str, Any]): Configuration dictionary with potential environment variable references.

    Returns:
        Dict[str, Any]: Configuration dictionary with resolved environment variables.
    """
    for key, value in config.items():
        if isinstance(value, str):
            if value.startswith("${") and value.endswith("}"):
                env_var = value[2:-1]  # Strip ${ and }
                config[key] = os.getenv(env_var, value)
        elif isinstance(value, dict):
            config[key] = resolve_env_vars(value)
    return config


def load_all_configs(config_files: Optional[List[str]] = None) -> Dict[str, Any]:
    """Load and merge all modular configurations.

    Args:
        config_files (List[str]): List of configuration file names. Defaults to DEFAULT_CONFIG_FILES.

    Returns:
        Dict[str, Any]: Combined configuration data with environment variables resolved.
    """
    base_path = Path(__file__).parent
    config_files = config_files or DEFAULT_CONFIG_FILES
    combined_config = {}

    for file_name in config_files:
        file_path = base_path / file_name
        if file_path.exists():
            logger.debug(f"Loading configuration file: {file_path}")
            config_data = load_yaml(file_path)
            combined_config.update(config_data)
        else:
            logger.warning(f"Configuration file not found: {file_path}")

    combined_config["env"] = os.getenv("ENV", DEFAULT_ENV)
    combined_config["language"] = os.getenv("LANGUAGE", "en")
    combined_config["snapshot_date"] = os.getenv(
        "SNAPSHOT_DATE", datetime.now().strftime("%Y-%m-%d")
    )
    return resolve_env_vars(combined_config)


def construct_database_url(config: Dict[str, Any]) -> str:
    """Construct a database URL from the configuration.

    Args:
        config (Dict[str, Any]): Configuration dictionary.

    Returns:
        str: Database connection URL.

    Raises:
        ValueError: If required database environment variables are missing.
    """
    # First try DATABASE_URL directly
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        return db_url

    # Try DATABASE_URL_DOCKER if running in Docker
    db_url_docker = os.getenv("DATABASE_URL_DOCKER")
    if db_url_docker and os.getenv("ENVIRONMENT") == "docker":
        return db_url_docker

    # Get required parameters from environment variables
    missing_vars = []
    db_host = os.getenv("POSTGRES_HOST")
    if not db_host:
        missing_vars.append("POSTGRES_HOST")

    db_port = os.getenv("POSTGRES_PORT")
    if not db_port:
        missing_vars.append("POSTGRES_PORT")

    db_user = os.getenv("POSTGRES_USER")
    if not db_user:
        missing_vars.append("POSTGRES_USER")

    db_password = os.getenv("POSTGRES_PASSWORD")
    if not db_password:
        missing_vars.append("POSTGRES_PASSWORD")

    db_name = os.getenv("POSTGRES_DB")
    if not db_name:
        missing_vars.append("POSTGRES_DB")

    # If any required variables are missing, raise an error
    if missing_vars:
        raise ValueError(
            f"Missing required database environment variables: {', '.join(missing_vars)}. "
            "Please set these in your environment or .env file."
        )

    return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"


# Main configuration loader
CONFIG = load_all_configs()
DATABASE_URL = construct_database_url(CONFIG)
LOG_TO_FILE = os.getenv("LOG_TO_FILE", "true").lower() == "true"
