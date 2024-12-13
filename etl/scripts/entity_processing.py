import logging
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd

from etl.utils.chunking_utils import save_to_csv_in_chunks
from etl.utils.extraction_helpers import get_extractor_function
from etl.utils.file_system_utils import ensure_directory_exists

logger = logging.getLogger(__name__)


def process_and_save_entity(
    data_records: pd.DataFrame,
    lang: str,
    entity_name: str,
    extract_data_path: str,
    chunk_size: int,
    entities: List[Dict[str, Any]],
    start_index: int = 1,
) -> int:
    """Process and save data for a specific entity.

    Args:
        data_records (pd.DataFrame): DataFrame of data records to process.
        lang (str): Language for processing the data.
        entity_name (str): Name of the entity being processed.
        extract_data_path (str): Path to save the extracted data.
        chunk_size (int): Size of chunks to save the data.
        entities (List[Dict[str, Any]]): List of entity configurations.
        start_index (int): Starting index for the chunk files.

    Raises:
        RuntimeError: If processing fails for the specified entity.

    Returns:
        int: The next starting index for subsequent chunks.
    """
    subfolder_path = Path(extract_data_path) / entity_name
    ensure_directory_exists(subfolder_path)

    logger.info(f"Starting processing for entity: {entity_name}")

    try:
        # Fetch the extractor function dynamically
        extractor_func = get_extractor_function(entity_name, entities)
        logger.debug(f"Extractor function resolved for {entity_name}: {extractor_func}")

        # Extract data using the extractor function
        extracted_data = extractor_func(data_records, lang)

        # Validate the extracted data
        if extracted_data.empty or not isinstance(extracted_data, pd.DataFrame):
            logger.warning(f"No valid data extracted for entity '{entity_name}'.")
            return start_index

        logger.info(
            f"Extracted {len(extracted_data)} records for entity '{entity_name}'."
        )

        # Save the extracted data in chunks
        output_base_name = subfolder_path / entity_name
        next_index = save_to_csv_in_chunks(
            extracted_data, str(output_base_name), chunk_size, start_index
        )
        logger.info(f"Processing and saving completed for entity: {entity_name}")
        return next_index
    except Exception as e:
        logger.error(f"Error processing entity '{entity_name}': {e}")
        raise RuntimeError(f"Error processing entity '{entity_name}': {e}")
