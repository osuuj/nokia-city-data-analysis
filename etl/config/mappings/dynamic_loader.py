import logging
import os

logger = logging.getLogger(__name__)

def load_toimi_mappings(base_path="etl/data/1_raw/mappings"):
    """
    Loads TOIMI mappings for various languages and categories.

    Args:
        base_path (str): Base directory containing the mapping files.

    Returns:
        dict: Nested dictionary containing TOIMI mappings.
    """
    categories = ["TOIMI", "TOIMI2", "TOIMI3"]
    languages = ["fi", "en", "sv"]

    all_mappings = {category: {lang: {} for lang in languages} for category in categories}

    for category in categories:
        for lang in languages:
            file_path = os.path.join(base_path, f"{category}_{lang}.txt")
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    for line in file:
                        # Split lines into code and description
                        code, description = line.strip().split('\t', 1)
                        all_mappings[category][lang][code] = description
                logger.info(f"Loaded {category} mappings for {lang} from {file_path}")
            except FileNotFoundError:
                logger.warning(f"File not found: {file_path}")
            except Exception as e:
                logger.error(f"Error loading {category} file for {lang} ({file_path}): {e}")

    return all_mappings
