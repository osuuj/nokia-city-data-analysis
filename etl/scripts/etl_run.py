"""
ETL pipeline orchestration script.

This module orchestrates the ETL pipeline by setting up the environment,
downloading and extracting raw data, processing JSON files, and handling
entity-specific data processing. Each stage of the pipeline is modularized
for clarity and maintainability.
"""
import time
import logging
import os
from etl.scripts.entity_processing import process_and_save_entity
from etl.scripts.data_fetcher import download_and_extract_files
from etl.scripts.extract_companies_data import process_json_directory
from etl.utils.chunking_utils import split_json_to_files
from etl.utils.file_system_utils import setup_directories
from etl.utils.json_utils import split_and_process_json
from etl.utils.network_utils import get_url, download_json_files
from etl.config.config_loader import load_config
from etl.config.logging.logging_config import configure_logging
from etl.pipeline.transform.cleaning import process_all_files

# Configure logging
configure_logging()
logger = logging.getLogger(__name__)

def setup_environment(config):
    """
    Set up directories and ensure the environment is ready for the ETL pipeline.
    """
    directories_to_create = [v for k, v in config['DIRECTORY_STRUCTURE'].items() if k != 'db_schema_path']
    setup_directories(directories_to_create)
    logger.info("Environment setup completed.")

def download_raw_data(config):
    """
    Download and extract raw data files.
    """
    url = get_url("all_companies", config['URL'])
    raw_file_path = os.path.join(config['RAW_DIR'], config['FILE_NAME'])
    extracted_dir = config['DIRECTORY_STRUCTURE']['extracted_dir']
    download_and_extract_files(url, raw_file_path, extracted_dir, config['CHUNK_SIZE'])
    logger.info("Raw data downloaded and extracted.")
    return extracted_dir

def download_json_mappings(config):
    """
    Download JSON mappings based on codes and languages.
    """
    base_url = config['URL']['base']
    endpoint_template = config['URL']['endpoints']['description']
    mappings_path = os.path.join(config['RAW_DIR'], 'mappings')
    os.makedirs(mappings_path, exist_ok=True)
    download_json_files(base_url, endpoint_template, config['codes'], config['langs'], mappings_path)
    logger.info("JSON mappings downloaded.")

def process_json_chunks(extracted_dir, config):
    """
    Process JSON chunks and return loaded records.
    """
    processed_dir = config['DIRECTORY_STRUCTURE']['processed_dir']
    split_and_process_json(extracted_dir, processed_dir, config['CHUNK_SIZE'])
    split_dir = os.path.join(processed_dir, 'chunks')
    json_records = process_json_directory(split_dir)
    logger.info(f"Total records loaded for processing: {len(json_records)}")
    return json_records.to_dict(orient='records')

def process_entities(data_records, config):
    """
    Process and save data for each entity based on the schema and configuration.
    """
    extract_data_path = os.path.join(config['DIRECTORY_STRUCTURE']['processed_dir'], 'extracted')
    os.makedirs(extract_data_path, exist_ok=True)

    for entity in config['ENTITIES']:
        entity_name = entity['name']
        lang = config['LANG']['english']
        process_and_save_entity(data_records, lang, entity_name, extract_data_path, config['CHUNK_SIZE'])

    cleaned_path = os.path.join(config['DIRECTORY_STRUCTURE']['processed_dir'], 'cleaned')
    os.makedirs(cleaned_path, exist_ok=True)

    for entity in config['ENTITIES']:
        entity_name = entity['name']
        schema_file = os.path.join(config['SCHEMA_PATH'], f"{entity_name}_schema.yml")
        process_all_files(extract_data_path, cleaned_path, entity_name, schema_file)
    logger.info("Entity processing and cleaning completed.")

def run_etl_pipeline():
    """
    Run the entire ETL pipeline.
    """
    start_time = time.time()
    config = load_config()

    try:
        # Step 1: Environment setup
        setup_environment(config)

        # Step 2: Download and extract raw data
        extracted_dir = download_raw_data(config)

        # Step 3: Download JSON mappings
        download_json_mappings(config)

        # Step 4: Process JSON chunks
        data_records = process_json_chunks(extracted_dir, config)

        # Step 5: Process entities
        process_entities(data_records, config)

        elapsed_time = time.time() - start_time
        logger.info(f"ETL pipeline completed in {elapsed_time:.2f} seconds.")

    except Exception as e:
        logger.error(f"ETL pipeline failed: {e}")
        raise

if __name__ == "__main__":
    run_etl_pipeline()
