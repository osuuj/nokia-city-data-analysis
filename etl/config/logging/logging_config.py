"""Logging Configuration Manager.

This module sets up logging for the ETL pipeline by using configurations defined
in `directory.yml` and `logging_config.yml`. It includes a custom `SensitiveDataFilter`
to sanitize sensitive information from log messages.
"""

import logging
import logging.config
from pathlib import Path

import yaml

from etl.config.config_loader import CONFIG, LOG_TO_FILE
from etl.config.logging.filters import SensitiveDataFilter

logger = logging.getLogger(__name__)


def configure_logging() -> None:
    """Set up logging for the ETL pipeline.

    This function configures logging for the ETL pipeline by:
    - Resolving paths for the logs directory and logging configuration file.
    - Ensuring the logs directory exists.
    - Loading the logging configuration from `logging_config.yml`.
    - Dynamically replacing placeholders in handler filenames with actual paths.
    - Adding a `SensitiveDataFilter` to all loggers to sanitize sensitive information.

    The function relies on `directory.yml` for the logging directory structure
    and `logging_config.yml` for the configuration of log handlers, formatters, and loggers.

    Raises:
        FileNotFoundError: If the logging configuration file is missing.
        Exception: For other general errors during logging configuration.
    """
    try:
        # Resolve paths for logs directory and configuration file
        logs_dir = Path(CONFIG["directory_structure"]["logs_dir"]).resolve()
        log_config_path = Path(CONFIG["config_files"]["logging_config_file"]).resolve()
        file_names = CONFIG["file_names"]

        # Ensure the logs directory exists
        logs_dir.mkdir(parents=True, exist_ok=True)

        # Check if the logging configuration file exists
        if not log_config_path.exists():
            logger.error(f"Logging configuration file not found: {log_config_path}")
            raise FileNotFoundError(
                f"Missing logging configuration file: {log_config_path}"
            )

        # Load the logging configuration
        with log_config_path.open("r", encoding="utf-8") as file:
            log_config = yaml.safe_load(file)

        # Replace placeholders in handlers with actual paths
        for handler in log_config.get("handlers", {}).values():
            if "filename" in handler:
                handler["filename"] = handler["filename"].format(
                    logs_dir=logs_dir,
                    standard_file=file_names["standard_log_file"],
                    debug_file=file_names["debug_log_file"],
                )

        # Dynamically adjust handlers for each logger based on LOG_TO_FILE
        if not LOG_TO_FILE:
            for logger_name, logger_conf in log_config.get("loggers", {}).items():
                logger_conf["handlers"] = [
                    h for h in logger_conf["handlers"] if "console" in h
                ]
            # Also update root logger
            if "root" in log_config:
                log_config["root"]["handlers"] = [
                    h for h in log_config["root"]["handlers"] if "console" in h
                ]
        # else: keep as defined (console + file or just file)

        # Apply the logging configuration
        logging.config.dictConfig(log_config)

        # Add the SensitiveDataFilter to all loggers
        sensitive_filter = SensitiveDataFilter()
        for logger_name in log_config.get("loggers", {}):
            logging.getLogger(logger_name).addFilter(sensitive_filter)

        logger.info("Logging successfully configured with sensitive data filtering.")
    except Exception as e:
        logger.error(f"Failed to configure logging: {e}")
        raise


def get_logger() -> logging.Logger:
    """Retrieve a logger based on the current environment.

    Returns:
        logging.Logger: A logger instance configured for the current environment.
    """
    env = CONFIG.get("env", "development")  # Default to 'development'
    return logging.getLogger(env)
