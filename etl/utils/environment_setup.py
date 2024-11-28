import os
import logging
from dotenv import load_dotenv

def configure_environment() -> None:
    """Load environment variables from .env file and configure logging."""
    try:
        load_dotenv()
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        logging.info("Environment variables loaded and logging configured.")
    except Exception as e:
        logging.error(f"Failed to configure environment: {e}")

def get_project_dir() -> str:
    """Get the project directory."""
    try:
        project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        logging.info("Project directory determined.")
        return project_dir
    except Exception as e:
        logging.error(f"Failed to get project directory: {e}")
        raise

def get_log_dir() -> str:
    """Get the log directory."""
    try:
        project_dir = get_project_dir()
        log_dir = os.path.join(project_dir, 'etl', 'data', 'logs')
        logging.info("Log directory determined.")
        return log_dir
    except Exception as e:
        logging.error(f"Failed to get log directory: {e}")
        raise
