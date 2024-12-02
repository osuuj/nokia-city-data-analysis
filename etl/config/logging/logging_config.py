import os
import logging
import logging.config
import yaml
from etl.config.config_loader import DIRECTORY_STRUCTURE
from etl.config.logging.filters import SensitiveDataFilter

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

    # Update the log file path in the configuration
    config['handlers']['file']['filename'] = log_file_path

    # Determine the environment (development or production)
    env = os.getenv('ENV', 'development')

    # Apply the appropriate logger configuration
    logging.config.dictConfig(config)
    logger = logging.getLogger(env)

    # Add the sensitive data filter to the logger
    sensitive_data_filter = SensitiveDataFilter()
    for handler in logger.handlers:
        handler.addFilter(sensitive_data_filter)

    # Configure the root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logger.level)
    for handler in logger.handlers:
        root_logger.addHandler(handler)

    logging.info("Logging is configured for %s environment.", env)
