"""
ETL pipeline orchestration script.

This module orchestrates the ETL pipeline by setting up the environment,
downloading and extracting raw data, processing JSON files, and handling
entity-specific data processing. Each stage of the pipeline is modularized
for clarity and maintainability.
"""
import os
import time
import pandas as pd
from pathlib import Path
from etl.scripts.entity_processing import process_and_save_entity
from etl.scripts.data_fetcher import download_and_extract_files
from etl.scripts.extract_companies_data import process_json_directory
from etl.utils.file_system_utils import setup_directories
from etl.utils.json_utils import split_and_process_json
from etl.utils.network_utils import get_url, download_mapping_files
from etl.config.logging.logging_config import configure_logging, get_logger
from etl.config.config_loader import load_all_configs
from etl.pipeline.transform.cleaning import clean_entity_files

# Configure logging
configure_logging()
logger = get_logger()
logger.info("Starting ETL pipeline")

def setup_environment(config):
    """
    Set up directories and ensure the environment is ready for the ETL pipeline.
    """
    directories_to_create = [v for k, v in config['directory_structure'].items() if k != 'db_schema_path']
    setup_directories(directories_to_create)
    logger.info("Environment setup completed.")

def download_raw_data(config):
    """
    Download and extract raw data files.
    """
    url = get_url("all_companies", config['url_templates'])
    raw_file_path = os.path.join(config['directory_structure']['raw_dir'], config['file_name'])
    extracted_dir = config['directory_structure']['extracted_dir']
    download_and_extract_files(url, raw_file_path, extracted_dir, config['chunk_size'])
    logger.info("Raw data downloaded and extracted.")
    return extracted_dir

def download_mappings(config):
    """
    Download JSON mappings based on codes and languages.
    """
    base_url = config['url_templates']['base']
    endpoint_template = config['url_templates']['endpoints']['description']
    mappings_path = os.path.join(config['directory_structure']['raw_dir'], 'mappings')
    os.makedirs(mappings_path, exist_ok=True)
    download_mapping_files(base_url, endpoint_template, config['codes'], config['languages'], mappings_path)
    logger.info("JSON mappings downloaded.")

def process_json_chunks(extracted_dir, config):
    """
    Process JSON chunks and return loaded records.
    """
    processed_dir = config['directory_structure']['processed_dir']
    split_and_process_json(extracted_dir, processed_dir, config['chunk_size'])
    split_dir = os.path.join(processed_dir, 'chunks')
    json_records = process_json_directory(split_dir)
    logger.info(f"Total records loaded for processing: {len(json_records)}")
    return json_records.to_dict(orient='records')

def process_entities(data_records, config):
    """
    Process and save data for each entity based on the schema and configuration.
    """
    extract_data_path = os.path.join(config['directory_structure']['processed_dir'], 'extracted')
    os.makedirs(extract_data_path, exist_ok=True)

    for entity in config['entities']:
        entity_name = entity['name']
        lang = config['languages']['english']
        process_and_save_entity(
            data_records, lang, entity_name, extract_data_path,
            config['chunk_size'], config['entities']
        )

    logger.info("Entity processing and cleaning completed.")

def clean_entities(config):
    """
    Cleans processed entity files.

    Args:
        config (dict): Configuration dictionary with paths and entity information.
    """
    extract_data_path = os.path.join(config['directory_structure']['processed_dir'], 'extracted')
    cleaned_data_path = os.path.join(config['directory_structure']['processed_dir'], 'cleaned')
    os.makedirs(cleaned_data_path, exist_ok=True)

    for entity in config['entities']:
        entity_name = entity['name']
        specific_columns = None

        # Apply specific cleaning rules for the "addresses" entity
        if entity_name == "addresses":
            specific_columns = ["post_code", "apartment_number", "building_number","post_office_box"]

        print(f"Cleaning data for entity: {entity_name}")
        clean_entity_files(extract_data_path, cleaned_data_path, entity_name, specific_columns)

    print("Cleaning of all entities completed.")
    
def run_etl_pipeline():
    """
    Run the entire ETL pipeline.
    """
    start_time = time.time()
    config = load_all_configs()
    try:
        # Step 1: Environment setup
        setup_environment(config)

        # Step 2: Download and extract raw data
        extracted_dir = download_raw_data(config)

        # Step 3: Download mappings
        download_mappings(config)

        # Step 4: Process JSON chunks
        data_records = process_json_chunks(extracted_dir, config)

        # Step 5: Process entities
        process_entities(data_records, config)
        
        # Step 6: Clean entities
        clean_entities(config)
        
        elapsed_time = time.time() - start_time
        logger.info(f"ETL pipeline completed in {elapsed_time:.2f} seconds.")

    except Exception as e:
        logger.error(f"ETL pipeline failed: {e}")
        raise

if __name__ == "__main__":
    run_etl_pipeline()
