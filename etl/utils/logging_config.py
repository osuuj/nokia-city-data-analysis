import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
def configure_logging() -> None:
    """Configure logging for the project."""
    project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    log_dir = os.path.join(project_dir, 'etl', 'logs')
    os.makedirs(log_dir, exist_ok=True)
    log_file_path = os.path.join(log_dir, 'etl.log')

    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()

    logging.basicConfig(level=log_level, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[
        logging.FileHandler(log_file_path),
        logging.StreamHandler()
    ])

# Call the function to configure logging
configure_logging()
