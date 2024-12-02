import os
from dotenv import load_dotenv
import yaml

# Load environment variables
load_dotenv()

CHUNK_SIZE = int(os.getenv('CHUNK_SIZE', 1000))
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config.yml')

def load_config(config_path=CONFIG_PATH):
    """Load and resolve the YAML configuration file."""
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    try:
        with open(config_path, 'r') as file:
            resolved_config = yaml.safe_load(file)
            if resolved_config is None:
                raise ValueError("Configuration file is empty.")
            return resolved_config
    except yaml.YAMLError as e:
        raise RuntimeError(f"YAML parsing error in configuration file: {e}")

def validate_config(config):
    required_keys = ['url', 'directory_structure']
    for key in required_keys:
        if key not in config:
            raise KeyError(f"Missing required configuration key: {key}")
        
CONFIG = load_config()

URL = CONFIG.get('url_templates', {})
DIRECTORY_STRUCTURE = CONFIG.get('directory_structure', {})
RAW_DIR = DIRECTORY_STRUCTURE.get('raw_dir', 'etl/data/1_raw/')
FILE_NAME = DIRECTORY_STRUCTURE.get('file_name', 'all_companies.zip')
ENTITIES = CONFIG.get('entities', [])
