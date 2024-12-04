import os
import pandas as pd
import logging
from etl.extract_companies_data import save_to_csv_in_chunks
from etl.utils.extraction_helpers import get_extractor_function

logger = logging.getLogger(__name__)

def process_and_save_entity(data_records,lang, entity_name, extract_data_path, chunk_size):
    """
    Process and save data for a specific entity.

    :param data_records: List of data records to process.
    :param entity_name: Name of the entity being processed.
    :param extract_data_path: Path to save the extracted data.
    :param chunk_size: Size of chunks to save the data.
    """
    subfolder_path = os.path.join(extract_data_path, entity_name)
    os.makedirs(subfolder_path, exist_ok=True)

    try:
        extractor_func = get_extractor_function(entity_name)
        extracted_data = extractor_func(data_records, lang)
        if not extracted_data:
            logger.warning(f"No data extracted for {entity_name}.")
            return

        logger.info(f"Extracted {len(extracted_data)} records for {entity_name}.")
        extracted_df = pd.DataFrame(extracted_data)
        save_to_csv_in_chunks(extracted_df, os.path.join(subfolder_path, entity_name), chunk_size)

    except Exception as e:
        logger.error(f"Error processing entity {entity_name}: {e}")
        raise
