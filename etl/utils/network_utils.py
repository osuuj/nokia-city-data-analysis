"""Utilities for network operations such as URL construction and file downloads.

This module provides functions to dynamically construct URLs based on templates
and download zip or raw text from APIs. It ensures downloaded files
are stored in the specified directory and handles common network-related errors.
"""

import logging
from pathlib import Path
from typing import Dict, List, Optional

import requests

from etl.utils.file_system_utils import ensure_directory_exists

logger = logging.getLogger(__name__)

# Constants
DEFAULT_TIMEOUT = 10  # Timeout for HTTP requests in seconds
DEFAULT_ENCODING = "utf-8"  # Encoding for saved text files


def get_url(
    endpoint_name: str,
    url_templates: Dict[str, Dict[str, str]],
    params: Optional[Dict[str, str]] = None,
) -> str:
    """Resolve a URL dynamically based on endpoint name and optional parameters.

    Args:
        endpoint_name (str): The name of the endpoint to resolve.
        url_templates (Dict[str, Dict[str, str]]): URL templates containing base URL and endpoints.
        params (Optional[Dict[str, str]]): Parameters to substitute in the endpoint template.

    Returns:
        str: The fully resolved URL.

    Raises:
        KeyError: If the endpoint_name is not found in the templates.
    """
    try:
        base_url = url_templates["base"]
        endpoint = url_templates["endpoints"][endpoint_name]
        if params:
            endpoint = endpoint.format(**params)
        resolved_url = f"{base_url}{endpoint}"
        logger.debug(f"Resolved URL for endpoint '{endpoint_name}': {resolved_url}")
        return resolved_url
    except KeyError as e:
        logger.error(f"Invalid endpoint or template key: {e}")
        raise


def download_mapping_files(
    base_url: str,
    endpoint_template: str,
    codes: List[str],
    languages: Dict[str, str],
    output_dir: Path,
) -> None:
    """Download files based on codes and languages and save them as text files.

    Args:
        base_url (str): The base URL for the API.
        endpoint_template (str): Template for constructing endpoints with placeholders.
                                 Example: "/data/{code}/{lang}/info"
        codes (List[str]): List of codes to include in the endpoint.
        languages (Dict[str, str]): Dictionary of language codes (e.g., {"en": "1"}).
        output_dir (Path): Directory where downloaded files will be saved.

    Raises:
        requests.RequestException: For network-related errors.
        OSError: If writing the file fails.
    """
    ensure_directory_exists(output_dir)

    for code in codes:
        for lang_code in languages.values():
            url = f"{base_url}{endpoint_template.format(code=code, lang=lang_code)}"
            file_name = f"{code}_{lang_code}.txt"
            file_path = output_dir / file_name

            try:
                logger.debug(f"Constructed file path: {file_path}")
                logger.info(f"Downloading from: {url}")
                response = requests.get(url, timeout=DEFAULT_TIMEOUT)
                response.raise_for_status()

                file_path.write_text(response.text, encoding=DEFAULT_ENCODING)
                logger.info(f"Downloaded successfully: {file_path}")
            except requests.RequestException as req_err:
                logger.error(f"Request failed for {url}: {req_err}")
                raise
            except OSError as os_err:
                logger.error(f"Failed to save file {file_path}: {os_err}")
                raise
