"""
Logging Configuration Manager

This module manages the dynamic setup of logging for the ETL pipeline. It integrates
with `directory.yml` and `logging_config.yml` to ensure logging paths and settings
are flexible and environment-specific.

Key Features:
- Dynamically replaces placeholders in `logging_config.yml` with values from `directory.yml`.
- Sets up rotating file handlers for standard and debug logs.
- Adds a sensitive data filter to all loggers.
"""

import logging
import logging.config
import os
import yaml
from etl.config.config_loader import CONFIG
from etl.config.logging.filters import SensitiveDataFilter


def configure_logging() -> None:
    """Set up logging for the ETL pipeline.

    This function:
    - Loads logging configuration from `logging_config.yml`.
    - Dynamically sets log file paths using `directory.yml`.
    - Configures handlers, formatters, and loggers based on the environment.
    - Adds a sensitive data filter to all loggers.

    Raises:
        Exception: If the logging configuration fails to load or apply.
    """
    logs_dir = CONFIG["directory_structure"]["logs_dir"]
    file_names = CONFIG["file_names"]

    # Ensure the logs directory exists
    os.makedirs(logs_dir, exist_ok=True)

    # Path to the logging configuration file
    log_config_path = os.path.join(
        os.path.dirname(__file__), CONFIG["config_files"]["logging_config_file"]
    )

    try:
        with open(log_config_path, "r") as file:
            log_config = yaml.safe_load(file)

        # Replace placeholders in logging configuration
        for handler in log_config.get("handlers", {}).values():
            if "filename" in handler:
                handler["filename"] = handler["filename"].format(
                    logs_dir=logs_dir,
                    standard_file=file_names["standard_log_file"],
                    debug_file=file_names["debug_log_file"],
                )

        # Apply the logging configuration
        logging.config.dictConfig(log_config)

        # Add sensitive data filter to all loggers
        sensitive_filter = SensitiveDataFilter()
        logging.getLogger().addFilter(sensitive_filter)

        logging.info("Logging successfully configured.")
    except Exception as e:
        logging.basicConfig(level=logging.ERROR)
        logging.exception("Failed to configure logging.")
        logging.error(f"Error: {e}")


def get_logger() -> logging.Logger:
    """Retrieve a logger based on the current environment.

    Returns:
        logging.Logger: A logger instance configured for the current environment.
    """
    env = CONFIG.get("env", "development")  # Default to 'development'
    return logging.getLogger(env)
