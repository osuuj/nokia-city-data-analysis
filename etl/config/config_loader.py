import os
from dotenv import load_dotenv
import yaml

# Load environment variables
load_dotenv()

CHUNK_SIZE = int(os.getenv('CHUNK_SIZE', 1000))
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config.yml')

def load_schemas(schemas_path):
    """Load and resolve the YAML configuration file."""
    if not os.path.exists(schemas_path):
        raise FileNotFoundError(f"Schemas file not found: {schemas_path}")
    try:
        with open(schemas_path, 'r') as file:
            resolved_schemas = yaml.safe_load(file)
            if resolved_schemas is None:
                raise ValueError("Schemas file is empty.")
            return resolved_schemas
    except yaml.YAMLError as e:
        raise RuntimeError(f"YAML parsing error in configuration file: {e}")

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

def construct_database_url(config):
    db_config = config.get('db', {})
    dbname = os.getenv('POSTGRES_DB', db_config.get('dbname', 'default_db'))
    user = os.getenv('POSTGRES_USER', db_config.get('user', 'default_user'))
    password = os.getenv('POSTGRES_PASSWORD', db_config.get('password', 'default_password'))
    host = os.getenv('DB_HOST', db_config.get('host', 'localhost'))
    port = os.getenv('DB_PORT', db_config.get('port', '5432'))
    return f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
        
CONFIG = load_config()
DATABASE_URL = construct_database_url(CONFIG)
URL = CONFIG.get('url_templates', {})
DIRECTORY_STRUCTURE = CONFIG.get('directory_structure', {})
RAW_DIR = DIRECTORY_STRUCTURE.get('raw_dir', 'etl/data/1_raw/')
FILE_NAME = DIRECTORY_STRUCTURE.get('file_name', 'all_companies.zip')
ENTITIES = CONFIG.get('entities', [])
SCHEMA_PATH = DIRECTORY_STRUCTURE.get('base_schema_path', 'etl/config/schemas')
LANG = CONFIG.get('lang', 'en')
DB_SCHEMA = DIRECTORY_STRUCTURE.get('db_schema_path', 'db/schema.sql')
codes = CONFIG.get('codes', [])
langs = CONFIG.get('langs', [])
