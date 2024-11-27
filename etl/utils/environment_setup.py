import os
import logging
from dotenv import load_dotenv

def configure_environment() -> None:
    """Load environment variables from .env file and configure logging."""
    load_dotenv()
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_project_dir() -> str:
    """Get the project directory."""
    return os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_log_dir() -> str:
    """Get the log directory."""
    project_dir = get_project_dir()
    return os.path.join(project_dir, 'etl', 'data', 'logs')
