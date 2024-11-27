import os
import logging
import logging.config
from etl.utils.environment_setup import configure_environment, get_log_dir

# Configure environment
configure_environment()

def configure_logging() -> None:
    """Configure logging for the project."""
    log_dir = get_log_dir()
    os.makedirs(log_dir, exist_ok=True)
    log_file_path = os.path.join(log_dir, 'etl.log')

    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()

    LOGGING_CONFIG = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'standard': {
                'format': '%(asctime)s - %(levelname)s - %(message)s'
            },
        },
        'handlers': {
            'console': {
                'level': log_level,
                'class': 'logging.StreamHandler',
                'formatter': 'standard'
            },
            'file': {
                'level': log_level,
                'class': 'logging.FileHandler',
                'filename': log_file_path,
                'formatter': 'standard',
            },
        },
        'loggers': {
            '': {
                'handlers': ['console', 'file'],
                'level': log_level,
                'propagate': True
            },
        }
    }

    logging.config.dictConfig(LOGGING_CONFIG)

# Call the function to configure logging
configure_logging()
