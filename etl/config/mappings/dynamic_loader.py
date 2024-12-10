import logging
import os
from typing import Dict

logger = logging.getLogger(__name__)

# Constants
CATEGORIES = ["TOIMI", "TOIMI2", "TOIMI3"]
LANGUAGES = ["fi", "en", "sv"]


def load_toimi_mappings(
    base_path: str = "etl/data/1_raw/mappings",
) -> Dict[str, Dict[str, Dict[str, str]]]:
    """Loads TOIMI mappings for various languages and categories.

    Args:
        base_path (str): Base directory containing the mapping files.

    Returns:
        Dict[str, Dict[str, Dict[str, str]]]: Nested dictionary containing TOIMI mappings.

    Raises:
        FileNotFoundError: If any required mapping file is not found.
        ValueError: If a mapping file has invalid content.
        Exception: If an unexpected error occurs during processing.
    """
    all_mappings: Dict[str, Dict[str, Dict[str, str]]] = {
        category: {lang: {} for lang in LANGUAGES} for category in CATEGORIES
    }

    for category in CATEGORIES:
        for lang in LANGUAGES:
            file_path = os.path.join(base_path, f"{category}_{lang}.txt")
            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    for line in file:
                        # Split lines into code and description
                        try:
                            code, description = line.strip().split("\t", 1)
                            all_mappings[category][lang][code] = description
                        except ValueError:
                            logger.error(f"Invalid line in file {file_path}: {line}")
                            raise ValueError(f"Invalid content in file {file_path}")
                logger.info(f"Loaded {category} mappings for {lang} from {file_path}")
            except FileNotFoundError as fnf_error:
                logger.warning(f"Error loading mapping: {fnf_error}")
                raise FileNotFoundError(
                    f"File not found: {file_path}"
                )  # Raising the exception
            except ValueError as val_error:
                logger.error(f"Error with mapping content: {val_error}")
                raise ValueError(
                    f"Invalid content in file: {file_path}"
                )  # Raising the exception
            except Exception as e:
                logger.error(f"Error with mapping content: {e}")
                raise Exception(f"Unknown error with file {file_path}: {e}")

    return all_mappings
