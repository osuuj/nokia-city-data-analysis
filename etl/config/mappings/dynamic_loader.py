"""Dynamic Loader for Mappings.

This module defines the `DynamicLoader` class, responsible for dynamically loading
mappings from YAML and CSV files. It supports loading TOIMI mappings and industry
2025 mappings, and provides methods for retrieving specific mappings based on
categories and languages.

Key Features:
- Load mappings from YAML and CSV files.
- Retrieve specific mappings by category and language.
- Handle errors and log warnings for missing or invalid mappings.
"""

import logging
from pathlib import Path
from typing import Any, Dict, Optional, Union

import pandas as pd
import yaml

from etl.config.config_loader import CONFIG

logger = logging.getLogger(__name__)

# Constants derived from CONFIG
TOIMI_FILES_PATH = Path(CONFIG["config_files"]["toimi_files_path"])
INDUSTRY_2025_FILE = Path(CONFIG["config_files"]["industry_2025_file"])
LANGUAGES = CONFIG[
    "languages"
].values()  # Extract language codes (e.g., ["fi", "en", "sv"])
CATEGORIES = CONFIG["codes"]  # Supported TOIMI categories

# Default YAML mappings key
DEFAULT_MAPPINGS_KEY = "mappings"


class DynamicLoader:
    """Class to dynamically load mappings."""

    def __init__(self, base_path: Path = TOIMI_FILES_PATH) -> None:
        """Initialize the DynamicLoader.

        Args:
            base_path (Path): Base path to the TOIMI files.
        """
        self.base_path = base_path

    def load_yaml_mapping(self, mappings_file: str) -> Dict[str, Any]:
        """Load mappings from a YAML file.

        Args:
            mappings_file (str): Path to the YAML mappings file.

        Returns:
            Dict[str, Any]: Parsed mappings data.

        Raises:
            FileNotFoundError: If the mappings file does not exist.
            KeyError: If the required mappings key is missing in the YAML file.
            yaml.YAMLError: If there is an error parsing the YAML file.
        """
        return self._load_yaml_file(mappings_file)

    def load_toimi_mapping(self, category: str, language: str) -> Dict[str, Any]:
        """Load a specific TOIMI mapping file.

        Args:
            category (str): The category of the mapping (e.g., "TOIMI3").
            language (str): The language code (e.g., "fi", "en").

        Returns:
            Dict[str, Any]: The loaded mapping data.

        Raises:
            FileNotFoundError: If the mapping file does not exist.
            ValueError: If there is an error parsing the plain text file.
        """
        file_path = self.base_path / f"{category}_{language}.txt"
        if not file_path.exists():
            raise FileNotFoundError(f"Mapping file not found: {file_path}")

        mapping = {}
        with file_path.open("r", encoding="utf-8") as file:
            for line in file:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue  # Skip empty lines and comments
                try:
                    key, value = line.split("\t", 1)
                    mapping[key.strip()] = value.strip()
                except ValueError as e:
                    logger.error(
                        f"Error parsing line in file {file_path}: {line} - {e}"
                    )
                    raise ValueError(
                        f"Error parsing line in file {file_path}: {line} - {e}"
                    )

        return mapping

    def load_industry_2025_mapping(self) -> Dict[str, Dict[str, str]]:
        """Load the industry 2025 mapping from a CSV file.

        Returns:
            Dict[str, Dict[str, str]]: The loaded industry 2025 mapping data.

        Raises:
            FileNotFoundError: If the industry 2025 file does not exist.
        """
        if not INDUSTRY_2025_FILE.exists():
            raise FileNotFoundError(
                f"Industry 2025 file not found: {INDUSTRY_2025_FILE}"
            )

        industry_mapping = {}
        df = pd.read_csv(INDUSTRY_2025_FILE)
        for _, row in df.iterrows():
            tol_code = row["TOL 2025"]
            industry_mapping[tol_code] = {
                "fi": row["Title_fi"],
                "en": row["Title_en"],
                "sv": row["Title_sv"],
                "category": row["Category"],
            }

        return industry_mapping

    def _load_yaml_file(self, file_path: str) -> Dict[str, Any]:
        """Load data from a YAML file.

        Args:
            file_path (str): Path to the YAML file.

        Returns:
            Dict[str, Any]: Parsed data from the YAML file.

        Raises:
            FileNotFoundError: If the file does not exist.
            KeyError: If the required key is missing in the YAML file.
            yaml.YAMLError: If there is an error parsing the YAML file.
        """
        path = Path(file_path).resolve()
        if not path.exists():
            raise FileNotFoundError(f"File not found: {path}")
        try:
            with path.open("r", encoding="utf-8") as file:
                data = yaml.safe_load(file) or {}
                mappings = data.get(DEFAULT_MAPPINGS_KEY)
                if not mappings:
                    raise KeyError(f"'{DEFAULT_MAPPINGS_KEY}' not found in {path}")
                logger.info(f"Loaded data from {path}: {list(mappings.keys())}")
                return mappings
        except yaml.YAMLError as e:
            logger.error(f"Error parsing YAML file {path}: {e}")
            raise


class Mappings:
    """Class to manage and access YAML-based mappings."""

    def __init__(self, mappings_file: str) -> None:
        """Initialize the Mappings class.

        Args:
            mappings_file (str): Path to the YAML mappings file.
        """
        self.mappings_file: Path = Path(mappings_file).resolve()
        self.mappings: Dict[str, Any] = self._load_mappings()

    def _load_mappings(self) -> Dict[str, Any]:
        """Load mappings from the YAML file.

        Returns:
            Dict[str, Any]: Parsed mappings data.

        Raises:
            FileNotFoundError: If the mappings file does not exist.
            KeyError: If the required mappings key is missing in the YAML file.
            yaml.YAMLError: If there is an error parsing the YAML file.
        """
        return DynamicLoader()._load_yaml_file(str(self.mappings_file))

    def get_mapping(
        self, mapping_name: str, language: Optional[str] = None
    ) -> Union[Dict[str, Any], str]:
        """Retrieve a specific mapping for a given language.

        Args:
            mapping_name (str): The name of the mapping.
            language (Optional[str]): The language code (e.g., 'en', 'fi').

        Returns:
            Union[Dict[str, Any], str]: The requested mapping.

        Raises:
            KeyError: If the mapping or language does not exist.
            TypeError: If the mapping type is unexpected.
        """
        mapping = self.mappings.get(mapping_name)
        if mapping is None:
            raise KeyError(
                f"Mapping '{mapping_name}' not found in {self.mappings_file}."
            )

        if isinstance(mapping, dict) and language:
            if language in mapping:
                return mapping[language]
            raise KeyError(
                f"Language '{language}' not supported for mapping '{mapping_name}'."
            )

        if isinstance(mapping, (str, dict)):
            return mapping
        raise TypeError(
            f"Unexpected type for mapping '{mapping_name}': {type(mapping).__name__}"
        )

    def validate_mapping(
        self, mapping_name: str, language: Optional[str] = None
    ) -> bool:
        """Validate a mapping for a given language and mapping name.

        Args:
            mapping_name (str): Name of the mapping to validate.
            language (Optional[str]): Language abbreviation (e.g., "fi", "en", "sv").

        Returns:
            bool: True if the mapping is valid, False otherwise.

        Raises:
            KeyError: If the mapping or language does not exist.
        """
        try:
            self.get_mapping(mapping_name, language)
            return True
        except KeyError:
            return False

    def validate_language(self, mapping_name: str) -> bool:
        """Validate if a language code exists in the mapping.

        Args:
            mapping_name (str): Name of the mapping to validate.

        Returns:
            bool: True if the language code is valid, False otherwise.
        """
        return mapping_name in self.mappings
