#!/bin/bash

# Exit on error, unset variables, and propagate pipe failures
set -euo pipefail

# Function to log messages with timestamp
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting ETL data loading process..."

# Handle both container and local environment
# If running locally, activate virtual environment
if [[ ! -z "${VIRTUAL_ENV:-}" ]]; then
  log "Already in a virtual environment: $VIRTUAL_ENV"
elif [[ -d "venvs/etl_env" ]]; then
  log "Activating local virtual environment..."
  source venvs/etl_env/bin/activate
  log "Activated: $VIRTUAL_ENV"
elif [[ -d "/app/venv" ]]; then
  log "Using container virtual environment..."
else
  log "ERROR: No virtual environment found. Please create it first."
  log "Run: python -m venv venvs/etl_env && source venvs/etl_env/bin/activate && pip install -r etl/requirements.txt"
  exit 1
fi

# Load environment variables (local dev only - containers use environment directly)
if [[ -z "${ENVIRONMENT:-}" || "$ENVIRONMENT" != "production" ]]; then
  if [[ -f ".env.compose" ]]; then
    log "Loading environment variables from .env.compose..."
    set -o allexport
    source .env.compose
    set +o allexport
  elif [[ -f ".env" ]]; then
    log "Loading environment variables from .env..."
    set -o allexport
    source .env
    set +o allexport
  fi
fi

# Set the snapshot date if not provided
if [[ -z "${SNAPSHOT_DATE:-}" ]]; then
  export SNAPSHOT_DATE=$(date +%Y-%m-%d)
  log "Using current date as snapshot date: $SNAPSHOT_DATE"
else
  log "Using provided snapshot date: $SNAPSHOT_DATE"
fi

# Set the language if not provided
if [[ -z "${LANGUAGE:-}" ]]; then
  export LANGUAGE="en"
  log "Using default language: $LANGUAGE"
else
  log "Using provided language: $LANGUAGE"
fi

# Print database connection info (mask password in logs)
DB_INFO="${POSTGRES_USER:-postgres}@${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-nokia_city_data}"
log "Database connection: $DB_INFO"

# Create status file for Docker healthcheck
STATUS_FILE="${ETL_LOG_DIR:-data/logs}/etl_status.txt"
mkdir -p "$(dirname "$STATUS_FILE")"
echo "$(date +'%Y-%m-%d %H:%M:%S') started" > "$STATUS_FILE"

# Run the ETL process with proper error handling
log "Running ETL data loading process..."
if python -m etl.pipeline.load.load_data; then
  log "ETL data loading completed successfully."
  echo "$(date +'%Y-%m-%d %H:%M:%S') success" > "$STATUS_FILE"
  exit 0
else
  ERROR_CODE=$?
  log "ERROR: ETL data loading failed with exit code $ERROR_CODE."
  echo "$(date +'%Y-%m-%d %H:%M:%S') failed" > "$STATUS_FILE"
  exit $ERROR_CODE
fi 