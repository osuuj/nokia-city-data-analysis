"""
Logging configuration.

This module sets up logging for the project based on a YAML configuration
file. It dynamically adjusts paths and includes filters for sensitive
information.
"""
import os
import logging
import logging.config
import yaml
from etl.config.config_loader import CONFIG
from etl.config.logging.filters import SensitiveDataFilter

def configure_logging() -> None:
    """Configure logging for the project."""
    logs_dir = CONFIG['directory_structure']['logs_dir']
    os.makedirs(logs_dir, exist_ok=True)
    log_file_path = os.path.join(logs_dir, 'etl.log')

    config_file_path = os.path.join(os.path.dirname(__file__), 'logging_config.yml')

    try:
        with open(config_file_path, 'r') as file:
            config = yaml.safe_load(file)

        config['handlers']['file']['filename'] = log_file_path
        logging.config.dictConfig(config)

        sensitive_filter = SensitiveDataFilter()
        logging.getLogger().addFilter(sensitive_filter)

        logging.info("Logging configured successfully.")
    except Exception as e:
        logging.basicConfig(level=logging.ERROR)
        logging.error(f"Failed to configure logging: {e}")
