"""
Utilities for network operations such as URL construction and file downloads.

This module provides functions to dynamically construct URLs based on templates
and download JSON files (or raw text) from APIs. It ensures downloaded files
are stored in the specified directory and handles common network-related errors.
"""
import os
import requests
import json
import logging
from etl.utils.file_system_utils import ensure_directory_exists

logger = logging.getLogger(__name__)

def get_url(endpoint_name, url_templates, params=None):
    """
    Resolve a URL dynamically based on endpoint name and optional parameters.
    """
    base_url = url_templates['base']
    endpoint = url_templates['endpoints'][endpoint_name]
    if params:
        endpoint = endpoint.format(**params)
    return f"{base_url}{endpoint}"

def download_json_files(base_url, endpoint_template, codes, langs, output_dir):
    """
    Download JSON files based on codes and languages.
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
                with open(file_path, 'w', encoding='utf-8') as file:
                    json.dump(response.json(), file, indent=4)
                logger.info(f"Downloaded: {file_path}")
            except Exception as e:
                logger.error(f"Failed to download {url}: {e}")
