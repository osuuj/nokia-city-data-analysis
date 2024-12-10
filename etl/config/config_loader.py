import os
from typing import Any, Dict

import yaml
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
CONFIG_FILES = ["db.yml", "directory.yml", "etl.yml"]
DEFAULT_ENV = "development"


def load_yaml(file_path: str) -> Dict[str, Any]:
    """Load a YAML file.

    Args:
        file_path (str): Path to the YAML file.

    Returns:
        Dict[str, Any]: Parsed YAML content.

    Raises:
        FileNotFoundError: If the file does not exist.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Configuration file not found: {file_path}")
    with open(file_path, "r") as file:
        return yaml.safe_load(file) or {}


def resolve_env_vars(config: Dict[str, Any]) -> Dict[str, Any]:
    """Resolve environment variables in the configuration.

    Args:
        config (Dict[str, Any]): Configuration dictionary with potential environment variable references.

    Returns:
        Dict[str, Any]: Configuration dictionary with resolved environment variables.
    """
    for key, value in config.items():
        if isinstance(value, str) and value.startswith("${"):
            env_var = value.strip("${}")
            config[key] = os.getenv(env_var, value)
        elif isinstance(value, dict):
            config[key] = resolve_env_vars(value)
    return config


def load_all_configs() -> Dict[str, Any]:
    """Load and merge all modular configurations.

    Returns:
        Dict[str, Any]: Combined configuration data with environment variables resolved.
    """
    base_path = os.path.dirname(__file__)
    combined_config = {}

    for file_name in CONFIG_FILES:
        file_path = os.path.join(base_path, file_name)
        if os.path.exists(file_path):
            config_data = load_yaml(file_path)
            combined_config.update(config_data)

    combined_config["env"] = os.getenv("ENV", DEFAULT_ENV)
    combined_config["mappings_path"] = os.path.join(base_path, "mappings/mappings.yml")

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


CONFIG = load_all_configs()
DATABASE_URL = construct_database_url(CONFIG)
