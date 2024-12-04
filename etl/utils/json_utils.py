import os
import json
import ijson
import logging
import requests
from etl.utils.directory_operations import ensure_directory_exists

# Initialize logger for JSON utilities
json_utils_logger = logging.getLogger('etl.json_utils')

def get_unzipped_file_name(extracted_dir):
    """Get the name of the file in the specified extracted directory."""
    try:
        files = [f for f in os.listdir(extracted_dir) if os.path.isfile(os.path.join(extracted_dir, f))]
        if len(files) == 1:
            return files[0]
        elif len(files) > 1:
            json_utils_logger.error(f"Multiple files found in {extracted_dir}: {files}")
            raise ValueError(f"Multiple files found in {extracted_dir}: {files}")
        else:
            json_utils_logger.error(f"No files found in {extracted_dir}.")
            raise FileNotFoundError(f"No files found in {extracted_dir}.")
    except Exception as e:
        json_utils_logger.error(f"Error accessing directory {extracted_dir}: {e}")
        raise RuntimeError(f"Error accessing directory {extracted_dir}: {e}")


def split_json_to_files(file_path, output_dir, chunk_size):
    """
    Splits a large JSON file into smaller JSON files.

    :param file_path: Path to the input JSON file
    :param output_dir: Directory where chunks will be saved
    :param chunk_size: Number of records per chunk
    """
    json_utils_logger.info(f"Splitting JSON file: {file_path} into chunks of size {chunk_size}")
    ensure_directory_exists(output_dir)

    try:
        chunk = []
        chunk_index = 1

        with open(file_path, 'r', encoding='utf-8') as file:
            for record in ijson.items(file, 'item'):
                chunk.append(record)
                if len(chunk) >= chunk_size:
                    output_file = os.path.join(output_dir, f"chunk_{chunk_index}.json")
                    with open(output_file, 'w', encoding='utf-8') as out_file:
                        json.dump(chunk, out_file, indent=4)
                    json_utils_logger.info(f"Saved chunk {chunk_index} with {len(chunk)} records to {output_file}")
                    chunk = []  # Clear the buffer
                    chunk_index += 1

            # Write remaining records
            if chunk:
                output_file = os.path.join(output_dir, f"chunk_{chunk_index}.json")
                with open(output_file, 'w', encoding='utf-8') as out_file:
                    json.dump(chunk, out_file, indent=4)
                json_utils_logger.info(f"Saved chunk {chunk_index} with {len(chunk)} records to {output_file}")
    except IOError as e:
        json_utils_logger.error(f"File I/O error during splitting JSON file {file_path}: {e}")
        raise
    except Exception as e:
        json_utils_logger.error(f"Error during splitting JSON file {file_path}: {e}")


def split_and_process_json(extracted_dir, splitter_dir, chunk_size):
    """
    Combine steps to find the unzipped file, split it into chunks, and return the path to split files.

    :param extracted_dir: Directory containing unzipped files
    :param splitter_dir: Directory where split files will be saved
    :param chunk_size: Number of records per chunk
    :return: Path to the directory containing split files
    """
    try:
        # Get the unzipped file name
        unzipped_file_path = os.path.join(extracted_dir, get_unzipped_file_name(extracted_dir))

        # Prepare the directory for split files
        split_dir = os.path.join(splitter_dir, 'chunks')
        json_utils_logger.info(f"Preparing to split unzipped file: {unzipped_file_path} into {split_dir}")
        split_json_to_files(unzipped_file_path, split_dir, chunk_size)

        return split_dir
    except Exception as e:
        json_utils_logger.error(f"Error during split and process JSON: {e}")
        raise

def get_url(endpoint_name, url_templates, params=None):
    """
    Resolve a URL dynamically based on endpoint name and optional parameters.

    :param endpoint_name: Name of the endpoint in configuration.
    :param url_templates: Dictionary containing URL templates.
    :param params: Optional dictionary for URL formatting.
    :return: Resolved URL string.
    """
    base_url = url_templates['base']
    endpoint = url_templates['endpoints'][endpoint_name]  # Fix: Access endpoint by key
    if params:
        endpoint = endpoint.format(**params)
    return f"{base_url}{endpoint}"

def download_json_files(base_url, endpoint_template, codes, langs, output_dir):
    """
    Download JSON files based on codes and languages.

    :param base_url: Base URL for the API
    :param endpoint_template: Endpoint template for the API
    :param codes: List of codes to include in the URL
    :param langs: List of languages to include in the URL
    :param output_dir: Directory where downloaded files will be saved
    """
    ensure_directory_exists(output_dir)
    for code in codes:
        for lang in langs:
            url = f"{base_url}{endpoint_template.format(code=code, lang=lang)}"
            file_name = f"{code}_{lang}.json"
            file_path = os.path.join(output_dir, file_name)
            try:
                response = requests.get(url)
                response.raise_for_status()
                # Validate JSON response
                try:
                    data = response.json()
                    with open(file_path, 'w', encoding='utf-8') as file:
                        json.dump(data, file, indent=4)
                    json_utils_logger.info(f"Downloaded JSON file to {file_path}")
                except json.JSONDecodeError:
                    # Save as text if not a valid JSON
                    text_file_path = file_path.replace('.json', '.txt')
                    with open(text_file_path, 'w', encoding='utf-8') as file:
                        file.write(response.text)
                    json_utils_logger.info(f"Downloaded text file to {text_file_path}")
            except requests.HTTPError as e:
                json_utils_logger.error(f"HTTP error while downloading JSON file from {url}: {e}")
            except requests.RequestException as e:
                json_utils_logger.error(f"Failed to download JSON file from {url}: {e}")
