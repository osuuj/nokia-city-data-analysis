import os
import logging
import logging.config
import yaml
from etl.config.config_loader import DIRECTORY_STRUCTURE

def configure_logging() -> None:
    """Configure logging for the project."""
    log_dir = DIRECTORY_STRUCTURE.get('logs_dir', os.path.join(os.getcwd(), 'etl', 'data', 'logs'))
    os.makedirs(log_dir, exist_ok=True)
    log_file_path = os.path.join(log_dir, 'etl.log')

    # Define the absolute path to the logging configuration file
    config_file_path = os.path.join(os.path.dirname(__file__), 'logging_config.yml')

    # Load logging configuration from YAML file
    with open(config_file_path, 'r') as file:
        config = yaml.safe_load(file)

    # Update the log file path and log level in the configuration
    config['handlers']['file']['filename'] = log_file_path
    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
    config['handlers']['console']['level'] = log_level
    config['handlers']['file']['level'] = log_level
    config['loggers']['']['level'] = log_level
    config['loggers']['etl']['level'] = log_level

    logging.config.dictConfig(config)
    logging.info("Logging is configured.")
