import os
from pathlib import Path
from dotenv import load_dotenv
import yaml

# Load .env file
load_dotenv()

# Paths
BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "../config/db.yml"

def load_yaml(file_path: Path) -> dict:
    """Load a YAML file."""
    if not file_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {file_path}")
    with file_path.open("r", encoding="utf-8") as file:
        return yaml.safe_load(file) or {}

def resolve_env_vars(config: dict) -> dict:
    """Resolve environment variables in configuration."""
    for key, value in config.items():
        if isinstance(value, str) and value.startswith("${") and value.endswith("}"):
            env_var = value[2:-1]  # Strip ${ and }
            config[key] = os.getenv(env_var, value)
        elif isinstance(value, dict):
            config[key] = resolve_env_vars(value)
    return config

def load_config() -> dict:
    """Load and resolve configuration from YAML and environment variables."""
    config = load_yaml(CONFIG_PATH)
    return resolve_env_vars(config)

# Load the configuration
CONFIG = load_config()

# Construct the database URL
DATABASE_URL = f"postgresql://{CONFIG['db']['user']}:{CONFIG['db']['password']}@{CONFIG['db']['host']}:{CONFIG['db']['port']}/{CONFIG['db']['name']}"
