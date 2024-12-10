"""
Configuration Loader

This module centralizes the loading, merging, and management of configurations 
for the ETL pipeline. It handles multiple YAML configuration files, resolves 
environment variables, and constructs runtime settings, including the database 
connection URL.
"""

import os
import logging
from typing import Any, Dict, List
import yaml
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

# Logger setup
logger = logging.getLogger(__name__)

# Constants
DEFAULT_ENV = "development"
DEFAULT_CONFIG_FILES = ["db.yml", "directory.yml", "etl.yml"]


def load_yaml(file_path: str) -> Dict[str, Any]:
    """Load a YAML file.

    Args:
        file_path (str): Path to the YAML file.

    Returns:
        Dict[str, Any]: Parsed YAML content.

    Raises:
        FileNotFoundError: If the file does not exist.
        yaml.YAMLError: If the YAML file is invalid.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Configuration file not found: {file_path}")

    try:
        with open(file_path, "r", encoding="utf-8") as file:
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


def load_all_configs(config_files: List[str] = None) -> Dict[str, Any]:
    """Load and merge all modular configurations.

    Args:
        config_files (List[str]): List of configuration file names. Defaults to DEFAULT_CONFIG_FILES.

    Returns:
        Dict[str, Any]: Combined configuration data with environment variables resolved.
    """
    base_path = os.path.dirname(__file__)
    config_files = config_files or DEFAULT_CONFIG_FILES
    combined_config = {}

    for file_name in config_files:
        file_path = os.path.join(base_path, file_name)
        if os.path.exists(file_path):
            logger.debug(f"Loading configuration file: {file_path}")
            config_data = load_yaml(file_path)
            combined_config.update(config_data)
        else:
            logger.warning(f"Configuration file not found: {file_path}")

    combined_config["env"] = os.getenv("ENV", DEFAULT_ENV)
    return resolve_env_vars(combined_config)


def construct_database_url(config: Dict[str, Any]) -> str:
    """Construct a database URL from the configuration.

    Args:
        config (Dict[str, Any]): Configuration dictionary.

    Returns:
        str: Database connection URL.
    """
    db_config = config.get("db", {})
    dbname = os.getenv("POSTGRES_DB", db_config.get("dbname", "default_db"))
    user = os.getenv("POSTGRES_USER", db_config.get("user", "default_user"))
    password = os.getenv(
        "POSTGRES_PASSWORD", db_config.get("password", "default_password")
    )
    host = os.getenv("DB_HOST", db_config.get("host", "localhost"))
    port = os.getenv("DB_PORT", db_config.get("port", "5432"))
    return f"postgresql://{user}:{password}@{host}:{port}/{dbname}"


# Main configuration loader
CONFIG = load_all_configs()
DATABASE_URL = construct_database_url(CONFIG)
