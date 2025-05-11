#!/bin/bash

# Exit on error
set -e

# Source the virtual environment
if [ -d "venvs/etl_env" ]; then
    echo "Activating virtual environment..."
    source venvs/etl_env/bin/activate
else
    echo "Virtual environment not found. Please create it first."
    echo "Run: python -m venv venvs/etl_env && source venvs/etl_env/bin/activate && pip install -r etl/requirements.txt"
    exit 1
fi

# Source environment variables from .env.compose
if [ -f ".env.compose" ]; then
    echo "Loading environment variables from .env.compose..."
    export $(grep -v '^#' .env.compose | xargs)
fi

# Set the snapshot date if not provided
if [ -z "$SNAPSHOT_DATE" ]; then
    export SNAPSHOT_DATE=$(date +%Y-%m-%d)
    echo "Using current date as snapshot date: $SNAPSHOT_DATE"
else
    echo "Using provided snapshot date: $SNAPSHOT_DATE"
fi

# Set the language if not provided
if [ -z "$LANGUAGE" ]; then
    export LANGUAGE="en"
    echo "Using default language: $LANGUAGE"
else
    echo "Using provided language: $LANGUAGE"
fi

# Print database connection info
echo "Database connection: $POSTGRES_USER@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB"

# Run the ETL process
echo "Running ETL data loading process..."
python -m etl.pipeline.load.load_data

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "ETL data loading completed successfully."
else
    echo "ETL data loading failed."
    exit 1
fi 