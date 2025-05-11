# Nokia City Data Analysis - ETL System

This directory contains the ETL (Extract, Transform, Load) system for the Nokia City Data Analysis project. It handles data extraction from various sources, transformation according to business rules, and loading into the target database.

## Features

- ✅ **Modular ETL Pipeline** - Separate components for extraction, transformation, and loading
- 🗄️ **Robust Data Processing** - Handles large datasets with chunking and memory-efficient processing
- 🔄 **Configurable Workflows** - YAML-based configuration for flexible pipeline customization
- 📊 **Data Validation** - Validation rules to ensure data quality and consistency
- 🧹 **Data Cleaning** - Comprehensive cleaning processes for addresses, company names, and more
- 🔍 **Entity Processing** - Specialized processing for different entity types
- 📝 **Extensive Logging** - Detailed logging for monitoring and troubleshooting
- 🐳 **Docker Support** - Containerized execution environment for consistent processing
- 🔧 **Development Tools** - Support for code formatting, linting, and type checking

## Project Structure

```
etl/
├── config/                  # Configuration files and loaders
│   ├── logging/             # Logging configuration
│   ├── mappings/            # Data mapping configurations
│   ├── config_loader.py     # Configuration loading utilities
│   ├── directory.yml        # Directory structure configuration
│   ├── entities.yml         # Entity processing configuration
│   ├── etl.yml              # Main ETL configuration
│   └── schema.sql           # Database schema for the target system
├── pipeline/                # ETL pipeline components
│   ├── extract/             # Data extraction modules
│   ├── transform/           # Data transformation modules
│   │   ├── cleaning/        # Data cleaning components
│   │   │   ├── address/     # Address cleaning utilities
│   │   │   ├── companies/   # Company data cleaning
│   │   │   ├── names/       # Name normalization
│   │   │   └── validation/  # Data validation
│   ├── load/                # Data loading modules
│   ├── data_fetcher.py      # Core data fetching utilities
│   ├── entity_processing.py # Entity processing logic
│   └── etl_run.py           # Main ETL orchestration script
├── data/                    # Data directories (managed by the pipeline)
│   ├── raw_data/            # Raw data from sources
│   ├── extracted_data/      # Extracted data files
│   └── processed_data/      # Processed data outputs
│       ├── chunks/          # Chunked data files
│       ├── cleaned/         # Cleaned data outputs
│       ├── extracted/       # Extracted entity data
│       └── staging/         # Staging data for loading
├── utils/                   # Utility functions
├── scripts/                 # Helper scripts and utilities
│   ├── run_etl_load.sh      # Script to load processed data into the database
│   └── setup_dev_env.sh     # Script to set up development environment
├── requirements.txt         # Production dependencies
└── requirements-dev.txt     # Development dependencies
```

## Getting Started

### Local Setup

#### Option 1: Using Helper Scripts (Recommended)

1. **Set up the development environment**:

   ```bash
   # Run the setup script to create virtual environment and install dependencies
   ./etl/scripts/setup_dev_env.sh
   ```

2. **Run the ETL extraction and transformation pipeline**:

   ```bash
   # Activate the virtual environment if not already activated
   source venvs/etl_env/bin/activate  # On Windows: venvs\etl_env\Scripts\activate
   
   # Run the ETL pipeline
   python -m etl.pipeline.etl_run
   ```

3. **Load processed data into the database**:

   ```bash
   # Make sure the database services are running (using docker-compose)
   docker-compose up -d
   
   # Run the data loading script
   ./etl/scripts/run_etl_load.sh
   
   # Or run the Python module directly
   python -m etl.pipeline.load.load_data
   ```

#### Option 2: Manual Setup

1. **Create a virtual environment**:

   ```bash
   python -m venv venvs/etl_env
   source venvs/etl_env/bin/activate  # On Windows: venvs\etl_env\Scripts\activate
   ```

2. **Install dependencies**:

   ```bash
   pip install -r etl/requirements.txt
   pip install -r etl/requirements-dev.txt  # For development tools
   ```

3. **Configure the ETL pipeline**:

   Review and modify configuration files in the `config/` directory as needed.

4. **Run the ETL pipeline**:

   ```bash
   python -m etl.pipeline.etl_run
   ```

### Docker Setup

The ETL system can also be run using Docker:

```bash
# Build the Docker image
docker build -t nokia-city-etl -f etl/Dockerfile .

# Run the ETL pipeline in a container
docker run --rm -v $(pwd)/etl/data:/app/etl/data nokia-city-etl
```

## Configuration

The ETL pipeline is configured through several YAML files:

### Main Configuration (`etl.yml`)

Contains primary ETL configuration settings:
- URL templates for data sources
- File naming conventions
- Chunk size for processing
- Snapshot date and language settings

### Directory Structure (`directory.yml`)

Configures the directory structure for data processing:
- Raw data directory
- Extracted data directory
- Processed data directories
- Log file locations

### Entity Configuration (`entities.yml`)

Defines entities to be processed and their attributes:
- Company entities
- Industry classifications
- Address components
- Required fields and validations

## Helper Scripts

### Setup Development Environment (`setup_dev_env.sh`)

This script automates the setup of the development environment:
- Creates and activates a Python virtual environment
- Installs required dependencies
- Sets up the ETL package in development mode
- Configures development tools

Usage:
```bash
./etl/scripts/setup_dev_env.sh
```

### Data Loading Script (`run_etl_load.sh`)

This script handles the data loading phase of the ETL pipeline:
- Handles virtual environment activation
- Loads environment variables from `.env` or `.env.compose`
- Sets default snapshot date and language if not provided
- Handles Docker integration with health checks
- Provides proper error reporting and status tracking

Usage:
```bash
# Set environment variables (optional)
export SNAPSHOT_DATE=2025-05-11
export LANGUAGE=en

# Run the loading process
./etl/scripts/run_etl_load.sh
```

## Development

### Code Quality Tools

The project uses several tools to maintain code quality:

- **Black**: Code formatting
  ```bash
  black etl/
  ```

- **Ruff**: Linting
  ```bash
  ruff check etl/
  ```

- **Pyright**: Static type checking
  ```bash
  pyright etl/
  ```

### Running Tests

To run the test suite:

```bash
pytest etl/tests/
```

For test coverage:

```bash
pytest --cov=etl etl/tests/ --cov-report=html
```

## Pipeline Execution

The ETL pipeline performs the following steps:

1. **Environment Setup**: Creates necessary directories
2. **Data Extraction**: Downloads and extracts raw data files
3. **Mapping Files**: Downloads required mapping files for data transformations
4. **JSON Processing**: Splits large JSON files into manageable chunks
5. **Entity Processing**: Processes entities based on configuration
6. **Data Cleaning**: Applies cleaning rules to addresses, names, etc.
7. **Data Transformation**: Transforms data according to business rules
8. **Data Loading**: Loads processed data into the target system

## Integration with Other Components

The ETL system prepares data for the FastAPI server component. After ETL processing is complete, the processed data is available for:

- API queries via the FastAPI server
- Visualization in the Next.js dashboard
- Analytics processing

For the complete system setup, refer to the main project documentation and the server README.

## Contributing

For detailed contribution guidelines, please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file in the project root. 