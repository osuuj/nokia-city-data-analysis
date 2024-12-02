import os
import json
import logging
import pandas as pd

logger = logging.getLogger(__name__)

def save_to_csv_in_chunks(df: pd.DataFrame, output_base_name: str, chunk_size: int) -> None:
    """Save a DataFrame to multiple CSV files in chunks."""
    num_chunks = (len(df) + chunk_size - 1) // chunk_size
    for i in range(num_chunks):
        chunk = df.iloc[i * chunk_size:(i + 1) * chunk_size]
        chunk_file_name = f"{output_base_name}_part{i + 1}.csv"
        chunk.to_csv(chunk_file_name, index=False, encoding='utf-8')
        logger.info(f"Saved chunk {i + 1} to {chunk_file_name}")


def process_json_directory(directory_path: str) -> pd.DataFrame:
    """Process JSON files in a directory into a DataFrame."""
    all_rows = []
    for file_name in os.listdir(directory_path):
        if file_name.endswith('.json'):
            file_path = os.path.join(directory_path, file_name)
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    if isinstance(data, list):
                        all_rows.extend(data)
                    else:
                        logger.error(f"Expected a list in {file_path}, got {type(data)}")
            except json.JSONDecodeError as e:
                logger.error(f"Error decoding JSON in {file_path}: {e}")
    return pd.DataFrame(all_rows)
