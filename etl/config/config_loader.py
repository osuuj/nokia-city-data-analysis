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

    return resolve_env_vars(combined_config)

# Load all configurations
CONFIG = load_all_configs()
