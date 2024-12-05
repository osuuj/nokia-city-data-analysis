import time
import logging
import os
from etl.config.logging.logging_config import configure_logging
from etl.config.logging.filters import ChunkProcessingFilter
from etl.utils.directory_operations import setup_directories
from etl.utils.json_utils import split_and_process_json, get_url, download_json_files
from etl.pipeline.entity_processing import process_and_save_entity
from etl.ingestion.data_fetcher import download_and_extract_files
from etl.config.config_loader import DIRECTORY_STRUCTURE, RAW_DIR, FILE_NAME, ENTITIES, CHUNK_SIZE, URL, LANG, SCHEMA_PATH,codes,langs
from etl.extract_companies_data import process_json_directory
from etl.pipeline.transform_data.cleaning import process_all_files
# Configure logging
configure_logging()
logger = logging.getLogger(__name__)
logger.addFilter(ChunkProcessingFilter())


def run_etl_pipeline():
    """
    Run the ETL pipeline: Download, extract, split, and process data.
    """
    start_time = time.time()

    try:
        # Step 1: Set up directories
        directories_to_create = [v for k, v in DIRECTORY_STRUCTURE.items() if k != 'db_schema_path']
        setup_directories(directories_to_create)

        # Step 2: Download and extract data
        url = get_url("all_companies", URL)
        raw_file_path = os.path.join(RAW_DIR, FILE_NAME)
        extracted_dir = DIRECTORY_STRUCTURE['extracted_dir']
        download_and_extract_files(url, raw_file_path, extracted_dir, CHUNK_SIZE)
        # Step 3: Download JSON files based on codes and languages
        base_url = URL['base']
        endpoint_template = URL['endpoints']['description']
        mappings_path = os.path.join(RAW_DIR, 'mappings')
        os.makedirs(mappings_path, exist_ok=True)
        download_json_files(base_url, endpoint_template, codes, langs, mappings_path)
        # Step 4: Split and process JSON files
        processed_dir = DIRECTORY_STRUCTURE['processed_dir']
        split_dir = split_and_process_json(extracted_dir, processed_dir, CHUNK_SIZE)

        ## Step 5: Load and process data
        extract_data_path = os.path.join(processed_dir, 'extracted')
        os.makedirs(extract_data_path, exist_ok=True)

        # Convert JSON chunks into a DataFrame
        split_dir = os.path.join(processed_dir, 'chunks')
        json_records = process_json_directory(split_dir)
        logger.info(f"Total records loaded for processing: {len(json_records)}")
        data_records = json_records.to_dict(orient='records')

        # Step 6: Process and save each entity
        for entity in ENTITIES:
            lang = LANG['english']
            entity_name = entity['name']
            process_and_save_entity(data_records, lang, entity_name, extract_data_path, CHUNK_SIZE)

        processed_data_path = os.path.join(processed_dir, 'cleaned')
        os.makedirs(processed_data_path, exist_ok=True)

        for entity in ENTITIES:
            entity_name = entity['name']
            schema_file = os.path.join(SCHEMA_PATH, f"{entity_name}_schema.yml")
            process_all_files(extract_data_path, processed_data_path, entity_name, schema_file)
        
        elapsed_time = time.time() - start_time
        logger.info(f"ETL pipeline completed in {elapsed_time:.2f} seconds.")

    except Exception as e:
        logger.error(f"ETL pipeline failed: {e}")
        raise

if __name__ == "__main__":
    run_etl_pipeline()
