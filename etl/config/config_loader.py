import os
import sys
import yaml
from string import Template
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Path to the configuration file
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config.yml')

def load_config(config_path=CONFIG_PATH):
    """
    Load and resolve the YAML configuration file.
    """
    try:
        with open(config_path, 'r') as file:
            raw_config = file.read()
            resolved_config = Template(raw_config).safe_substitute(os.environ)
            return yaml.safe_load(resolved_config)
    except Exception as e:
        sys.exit(f"Error loading configuration file: {e}")

# Load the configuration
CONFIG = load_config()

# Extract specific sections for easy import
URL = CONFIG.get('url', {})
DIRECTORY_STRUCTURE = CONFIG.get('directory_structure', {})

# Extract individual directory paths and file name
RAW_DIR = DIRECTORY_STRUCTURE.get('raw_dir', 'etl/data/1_raw')
FILE_NAME = DIRECTORY_STRUCTURE.get('file_name', 'all_companies.zip')
