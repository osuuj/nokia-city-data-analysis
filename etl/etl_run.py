import time
import logging
import os
from etl.config.logging.logging_config import configure_logging
from etl.config.logging.filters import ChunkProcessingFilter
from etl.utils.directory_operations import setup_directories
from etl.utils.json_utils import split_and_process_json, get_url
from etl.pipeline.entity_processing import process_and_save_entity
from etl.ingestion.data_fetcher import download_and_extract_files
from etl.config.config_loader import DIRECTORY_STRUCTURE, RAW_DIR, FILE_NAME, ENTITIES, CHUNK_SIZE, URL
from etl.extract_companies_data import process_json_directory

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
        setup_directories(list(DIRECTORY_STRUCTURE.values()))

        # Step 2: Download and extract data
        #url = get_url("all_companies", URL)
        #raw_file_path = os.path.join(RAW_DIR, FILE_NAME)
        #extracted_dir = DIRECTORY_STRUCTURE['extracted_dir']
        #download_and_extract_files(url, raw_file_path, extracted_dir, CHUNK_SIZE)#

        ## Step 3: Split and process JSON files
        splitter_dir = DIRECTORY_STRUCTURE['processed_dir']
        #split_dir = split_and_process_json(extracted_dir, splitter_dir, CHUNK_SIZE)

        # Step 4: Load and process data
        extract_data_path = os.path.join(splitter_dir, 'extracted')
        os.makedirs(extract_data_path, exist_ok=True)

        # Convert JSON chunks into a DataFrame
        split_dir = os.path.join(splitter_dir, 'chunks')
        json_records = process_json_directory(split_dir)
        logger.info(f"Total records loaded for processing: {len(json_records)}")
        data_records = json_records.to_dict(orient='records')

        # Step 5: Process and save each entity
        for entity in ENTITIES:
            entity_name = entity['name']
            process_and_save_entity(data_records, entity_name, extract_data_path, CHUNK_SIZE)

        elapsed_time = time.time() - start_time
        logger.info(f"ETL pipeline completed in {elapsed_time:.2f} seconds.")

    except Exception as e:
        logger.error(f"ETL pipeline failed: {e}")
        raise


if __name__ == "__main__":
    run_etl_pipeline()
