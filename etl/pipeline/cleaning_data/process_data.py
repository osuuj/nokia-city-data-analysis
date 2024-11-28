import json
import os
import logging
import glob
import time
import pandas as pd
from typing import Dict, Tuple
from etl.pipeline.cleaning_data.process_business_info import process_business_info
from etl.pipeline.cleaning_data.process_names import process_names
from etl.pipeline.cleaning_data.process_addresses import process_addresses
from etl.pipeline.cleaning_data.process_company_forms import process_company_forms
from etl.pipeline.cleaning_data.process_registered_entries import process_registered_entries
from etl.pipeline.cleaning_data.process_business_name_history import process_business_name_history
from etl.utils.file_operations import save_to_csv

logger = logging.getLogger(__name__)

def save_processed_data(cleaned_dir: str, city: str, idx: int, data: Dict[str, Tuple]) -> None:
    """
    Helper function to save processed data to CSV files.
    Handles both cleaned and error DataFrames.
    """
    for key, (cleaned_df, error_df) in data.items():
        cleaned_filename = os.path.join(cleaned_dir, f"cleaned_{city}_part_{idx+1}_{key}.csv")
        error_filename = os.path.join(cleaned_dir, f"errors_{city}_part_{idx+1}_{key}.csv")

        # Save cleaned data
        if not cleaned_df.empty:
            save_to_csv(cleaned_filename, cleaned_df.to_dict(orient='records'), headers=cleaned_df.columns)
            logger.debug(f"Processed {key} data saved for city: {city}")

        # Save errors
        if not error_df.empty:
            save_to_csv(error_filename, error_df.to_dict(orient='records'), headers=error_df.columns)
            logger.warning(f"Error {key} data saved for city: {city}")

def process_data(city: str, project_dir: str, city_paths: dict) -> None:
    """
    Process the JSON data and save it to CSV files.
    Handles both cleaned and error data outputs.
    """
    start_time = time.time()
    try:
        split_dir = city_paths['split_dir']
        cleaned_dir = city_paths['cleaned_dir']

        os.makedirs(split_dir, exist_ok=True)
        os.makedirs(cleaned_dir, exist_ok=True)

        json_files = glob.glob(os.path.join(split_dir, '*.json'))
        if not json_files:
            logger.error(f"No JSON files found in {split_dir}")
            return

        for idx, json_file in enumerate(json_files):
            with open(json_file, 'r', encoding='utf-8') as f:
                json_data = json.load(f)
            
            if not json_data:
                logger.error(f"JSON data is None for file {json_file}")
                continue

            data_processors = {
                "business_info": process_business_info,
                "names": process_names,
                "addresses": process_addresses,
                "company_forms": process_company_forms,
                "registered_entries": process_registered_entries,
                "business_name_history": process_business_name_history
            }

            processed_data = {}
            for key, processor in data_processors.items():
                try:
                    cleaned_df, error_df = processor(json_data)
                    processed_data[key] = (cleaned_df, error_df)
                except Exception as e:
                    logger.error(f"Error processing {key} for file {json_file}: {e}")
                    processed_data[key] = (pd.DataFrame(), pd.DataFrame())  # Return empty DataFrames for errors

            save_processed_data(cleaned_dir, city, idx, processed_data)

    except Exception as e:
        logger.error(f"An error occurred while processing data for {city}. Error: {e}")
        raise
    finally:
        end_time = time.time()
        elapsed_time = end_time - start_time
        logger.info(f"Processing data for city {city} took {elapsed_time:.2f} seconds")
