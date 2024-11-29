import time
import logging
import os
import pandas as pd
import json
from etl.config.logging_config import configure_logging
from etl.utils.directory_operations import setup_directories
from etl.utils.file_operations import split_json_to_files, get_unzipped_file_name
from etl.pipeline.extract_data.download_extract_files import download_and_extract_files
from etl.pipeline.extract_data.extract_companies_data import (
    process_json_directory, save_to_csv_in_chunks, extract_companies,
    extract_names, extract_main_business_lines, extract_business_line_descriptions,
    extract_company_forms, 
    extract_company_form_descriptions,
    extract_company_situations,
    extract_registered_entries, extract_registered_entry_descriptions, extract_addresses,
    extract_post_offices
)
from etl.config.config_loader import URL, DIRECTORY_STRUCTURE, RAW_DIR, FILE_NAME

class ChunkProcessingFilter(logging.Filter):
    def filter(self, record):
        return not record.getMessage().startswith("Processing etl/data/3_processed/chunks/chunk_")

# Configure logging
configure_logging()
logger = logging.getLogger(__name__)
logger.addFilter(ChunkProcessingFilter())

def run_etl_pipeline() -> None:
    """Run the ETL pipeline."""

    start_time = time.time()
    # Step 1: Setup directories
    setup_directories(list(DIRECTORY_STRUCTURE.values()))

    # Step 2: Construct full file path
    raw_file_path = os.path.join(RAW_DIR, FILE_NAME)

    # Step 3: Download and extract files
    url = URL['all_companies']
    extracted_dir = DIRECTORY_STRUCTURE['extracted_dir']
    splitter_dir = DIRECTORY_STRUCTURE['processed_dir']
    splitted_file_path = os.path.join('etl', 'data', '3_processed', 'chunks')

    start_time = time.time()
    download_and_extract_files(url, raw_file_path, extracted_dir)
    end_time = time.time()
    elapsed_time = end_time - start_time
    logger.info(f"Download and extraction completed in {elapsed_time:.2f} seconds.")

    path_to_splitted = os.path.join(extracted_dir, get_unzipped_file_name(extracted_dir))

    start_time = time.time()
    split_json_to_files(path_to_splitted, splitted_file_path, chunk_size=1000)
    end_time = time.time()
    elapsed_time = end_time - start_time
    logger.info(f"Split and save completed in {elapsed_time:.2f} seconds.")

    extract_data_path = os.path.join(splitter_dir, 'extracted')
    os.makedirs(extract_data_path, exist_ok=True)
    
    df = process_json_directory(splitted_file_path)
    logger.info(f"Number of records to process: {len(df)}")
    
    # Convert the DataFrame to a list of dictionaries
    data_records = df.to_dict(orient='records')
    
    # Process and save companies data
    subfolder_path = os.path.join(extract_data_path, 'companies')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_companies(data_records)
    if not extracted_data:
        logger.info("No data extracted for companies")
    else:
        logger.info(f"Extracted {len(extracted_data)} company entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'companies'))
    
    # Process and save names data
    subfolder_path = os.path.join(extract_data_path, 'names')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_names(data_records)
    if not extracted_data:
        logger.info("No data extracted for names")
    else:
        logger.info(f"Extracted {len(extracted_data)} name entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'names'))

    # Process and save main business lines data
    subfolder_path = os.path.join(extract_data_path, 'main_business_lines')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_main_business_lines(data_records)
    if not extracted_data:
        logger.info("No data extracted for main business lines")
    else:
        logger.info(f"Extracted {len(extracted_data)} main business line entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'main_business_lines'))

    # Process and save business line descriptions data
    subfolder_path = os.path.join(extract_data_path, 'business_line_descriptions')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_business_line_descriptions(data_records)
    if not extracted_data:
        logger.info("No data extracted for business line descriptions")
    else:
        logger.info(f"Extracted {len(extracted_data)} business line description entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'business_line_descriptions'))

    # Process and save company forms data
    subfolder_path = os.path.join(extract_data_path, 'company_forms')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_company_forms(data_records)
    if not extracted_data:
        logger.info("No data extracted for company forms")
    else:
        logger.info(f"Extracted {len(extracted_data)} company form entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'company_forms'))

    # Process and save company form descriptions data
    subfolder_path = os.path.join(extract_data_path, 'company_form_descriptions')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_company_form_descriptions(data_records)
    if not extracted_data:
        logger.info("No data extracted for company form descriptions")
    else:
        logger.info(f"Extracted {len(extracted_data)} company form description entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'company_form_descriptions'))

    # Process and save company situations data
    subfolder_path = os.path.join(extract_data_path, 'company_situations')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_company_situations(data_records)
    if not extracted_data:
        logger.info("No data extracted for company situations")
    else:
        logger.info(f"Extracted {len(extracted_data)} company situation entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'company_situations'))

    # Process and save registered entries data
    subfolder_path = os.path.join(extract_data_path, 'registered_entries')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_registered_entries(data_records)
    if not extracted_data:
        logger.info("No data extracted for registered entries")
    else:
        logger.info(f"Extracted {len(extracted_data)} registered entry entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'registered_entries'))

    # Process and save registered entry descriptions data
    subfolder_path = os.path.join(extract_data_path, 'registered_entry_descriptions')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_registered_entry_descriptions(data_records)
    if not extracted_data:
        logger.info("No data extracted for registered entry descriptions")
    else:
        logger.info(f"Extracted {len(extracted_data)} registered entry description entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'registered_entry_descriptions'))
    
    # Process and save addresses data
    subfolder_path = os.path.join(extract_data_path, 'addresses')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_addresses(data_records)
    if not extracted_data:
        logger.info("No data extracted for addresses")
    else:
        logger.info(f"Extracted {len(extracted_data)} address entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'addresses'))
    
    # Process and save post offices data
    subfolder_path = os.path.join(extract_data_path, 'post_offices')
    os.makedirs(subfolder_path, exist_ok=True)
    extracted_data = extract_post_offices(data_records)
    if not extracted_data:
        logger.info("No data extracted for post offices")
    else:
        logger.info(f"Extracted {len(extracted_data)} post office entries")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, 'post_offices'))
    
    end_time = time.time()
    elapsed_time = end_time - start_time
    logger.info(f"ETL pipeline completed in {elapsed_time:.2f} seconds.")

def main() -> None:
    """Main function to run the ETL process."""
    run_etl_pipeline()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.error(f"An error occurred during the ETL process: {e}")
