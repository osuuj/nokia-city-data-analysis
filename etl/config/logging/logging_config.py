import logging
import logging.config
import os

import yaml

from etl.config.config_loader import CONFIG
from etl.config.logging.filters import SensitiveDataFilter

# Constants
LOG_FILE = "etl.log"
DEBUG_LOG_FILE = "etl_debug.log"
LOG_CONFIG_FILE = "logging_config.yml"


def configure_logging() -> None:
    """Configure logging for the ETL project.

    This function sets up logging by:
    - Creating necessary log directories.
    - Loading logging configurations from a YAML file.
    - Dynamically setting the log file paths for standard and debug logs.
    - Adding a custom sensitive data filter to all loggers.

    Raises:
        Exception: If the logging configuration fails to load or apply.
    """
    logs_dir = CONFIG["directory_structure"]["logs_dir"]
    os.makedirs(logs_dir, exist_ok=True)
    log_file_path = os.path.join(logs_dir, LOG_FILE)
    debug_log_file_path = os.path.join(logs_dir, DEBUG_LOG_FILE)

    config_file_path = os.path.join(os.path.dirname(__file__), LOG_CONFIG_FILE)

    try:
        with open(config_file_path, "r") as file:
            config = yaml.safe_load(file)

        # Dynamically set the log file paths
        if "handlers" in config:
            if "file_standard" in config["handlers"]:
                config["handlers"]["file_standard"]["filename"] = log_file_path
            if "file_debug" in config["handlers"]:
                config["handlers"]["file_debug"]["filename"] = debug_log_file_path

        logging.config.dictConfig(config)

        # Add sensitive data filter
        sensitive_filter = SensitiveDataFilter()
        logging.getLogger().addFilter(sensitive_filter)

        logging.info("Logging configured successfully.")
    except Exception as e:
        logging.basicConfig(level=logging.ERROR)
        logging.exception("Failed to configure logging")
        logging.error(f"Error: {e}")


def get_logger() -> logging.Logger:
    """Retrieve a logger configured for the current environment.

    This function returns a logger whose configuration depends on the
    `env` key in the global configuration. If the environment is not
    explicitly set, it defaults to 'development'.

    Returns:
        logging.Logger: A logger instance configured for the current environment.
    """
    env = CONFIG.get("env", "development")  # Default to 'development'
    return logging.getLogger(env)
