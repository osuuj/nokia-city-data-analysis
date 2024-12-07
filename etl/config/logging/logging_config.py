import logging
import logging.config
import os

import yaml

from etl.config.config_loader import CONFIG
from etl.config.logging.filters import SensitiveDataFilter


def configure_logging() -> None:
    """Configure logging for the project."""
    logs_dir = CONFIG["directory_structure"]["logs_dir"]
    os.makedirs(logs_dir, exist_ok=True)
    log_file_path = os.path.join(logs_dir, "etl.log")
    debug_log_file_path = os.path.join(logs_dir, "etl_debug.log")

    config_file_path = os.path.join(os.path.dirname(__file__), "logging_config.yml")

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
        logging.error(f"Failed to configure logging: {e}")


def get_logger() -> logging.Logger:
    """
    Retrieve the logger dynamically based on the environment.

    Returns:
        logging.Logger: Configured logger instance.
    """
    env = CONFIG.get("env", "development")  # Default to 'development'
    return logging.getLogger(env)
