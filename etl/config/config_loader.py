import os
import yaml
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def load_yaml(file_path):
    """Load a YAML file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Configuration file not found: {file_path}")
    with open(file_path, 'r') as file:
        return yaml.safe_load(file) or {}

def resolve_env_vars(config):
    """Resolve environment variables in the configuration."""
    for key, value in config.items():
        if isinstance(value, str) and value.startswith('${'):
            env_var = value.strip('${}')
            config[key] = os.getenv(env_var, value)
        elif isinstance(value, dict):
            config[key] = resolve_env_vars(value)
    return config

def load_all_configs():
    """Load and merge all modular configurations."""
    base_path = os.path.dirname(__file__)
    config_files = ['db.yml', 'directory.yml', 'etl.yml']
    combined_config = {}

    for file_name in config_files:
        file_path = os.path.join(base_path, file_name)
        config_data = load_yaml(file_path)
        combined_config.update(config_data)

    # Add environment variable to configuration
    combined_config['env'] = os.getenv("ENV", "development")  # Default to 'development'

    # Add mappings path
    combined_config['mappings_path'] = os.path.join(base_path, 'mappings/mappings.yml')

    return resolve_env_vars(combined_config)

def construct_database_url(config):
    db_config = config.get('db', {})
    dbname = os.getenv('POSTGRES_DB', db_config.get('dbname', 'default_db'))
    user = os.getenv('POSTGRES_USER', db_config.get('user', 'default_user'))
    password = os.getenv('POSTGRES_PASSWORD', db_config.get('password', 'default_password'))
    host = os.getenv('DB_HOST', db_config.get('host', 'localhost'))
    port = os.getenv('DB_PORT', db_config.get('port', '5432'))
    return f"postgresql://{user}:{password}@{host}:{port}/{dbname}"

CONFIG = load_all_configs()

# Example usage
database_url = construct_database_url(CONFIG)
