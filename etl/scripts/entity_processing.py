""""
Entity-specific processing utilities.

This module provides functions to process data for individual entities
using dynamically resolved extractor functions. Processed data is saved
in chunks for efficient storage and handling.
"""
import os
import pandas as pd
import logging
from etl.utils.chunking_utils import save_to_csv_in_chunks
from etl.utils.extraction_helpers import get_extractor_function

logger = logging.getLogger(__name__)

def process_and_save_entity(data_records, lang, entity_name, extract_data_path, chunk_size, entities):
    """
    Process and save data for a specific entity.

    :param data_records: List of data records to process.
    :param lang: Language for processing the data.
    :param entity_name: Name of the entity being processed.
    :param extract_data_path: Path to save the extracted data.
    :param chunk_size: Size of chunks to save the data.
    :param entities: List of entity configurations.
    """
    subfolder_path = os.path.join(extract_data_path, entity_name)
    os.makedirs(subfolder_path, exist_ok=True)

    logger.info(f"Starting processing for entity: {entity_name}")
    try:
        # Fetch the extractor function dynamically
        extractor_func = get_extractor_function(entity_name, entities)
        extracted_data = extractor_func(data_records, lang)

        # Validate extracted data
        if not extracted_data or not isinstance(extracted_data, list):
            logger.warning(f"No valid data extracted for {entity_name}.")
            return

        logger.info(f"Extracted {len(extracted_data)} records for {entity_name}.")
        extracted_df = pd.DataFrame(extracted_data)

        # Save the data in chunks
        output_base_name = os.path.join(subfolder_path, entity_name)
        save_to_csv_in_chunks(extracted_df, output_base_name, chunk_size)
        logger.info(f"Processing and saving completed for entity: {entity_name}")
    except Exception as e:
        logger.error(f"Error processing entity {entity_name}: {e}")
        raise
