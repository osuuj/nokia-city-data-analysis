#!/bin/bash

# Exit on error, unset variables, and propagate pipe failures
set -euo pipefail

# Function to log messages with timestamp
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Setting up ETL development environment..."

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
log "Project root: $PROJECT_ROOT"

# Create the virtual environment directory if it doesn't exist
VENV_DIR="$PROJECT_ROOT/venvs/etl_env"
log "Setting up virtual environment at: $VENV_DIR"

if [[ ! -d "$VENV_DIR" ]]; then
  log "Creating virtual environment in $VENV_DIR..."
  python -m venv "$VENV_DIR"
else
  log "Virtual environment already exists in $VENV_DIR"
fi

# Determine the correct activation script based on OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  ACTIVATE_SCRIPT="$VENV_DIR/Scripts/activate"
else
  ACTIVATE_SCRIPT="$VENV_DIR/bin/activate"
fi

# Activate the virtual environment
log "Activating virtual environment..."
source "$ACTIVATE_SCRIPT"
log "Python version: $(python --version)"
log "Pip version: $(pip --version)"

# Upgrade pip
log "Upgrading pip..."
pip install --upgrade pip

# Install base and dev dependencies
log "Installing core and development dependencies..."
pip install -r "$PROJECT_ROOT/etl/requirements.txt"
pip install -r "$PROJECT_ROOT/etl/requirements-dev.txt"

# Check installation
log "Verifying installation..."
pip list

log "ETL development environment setup complete!"
log "To activate the environment, run:"
log "source $ACTIVATE_SCRIPT"