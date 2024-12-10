"""Mappings Loader

This module provides utilities to load, manage, and validate static mappings 
from a centralized YAML file. The mappings file is expected to define various 
configuration data, such as language codes, status mappings, and type mappings, 
which are used across the ETL pipeline.
"""

from typing import Any, Dict, Optional, TypedDict, Union
import logging
import os
import yaml


# TypedDict for language mappings
class LanguageMapping(TypedDict, total=False):
    fi: Dict[str, str]
    sv: Dict[str, str]
    en: Dict[str, str]


# TypedDict for the root of the mappings
class MappingsDict(TypedDict):
    default_country: str
    language_code_mapping: Dict[str, str]
    post_office_language_code: Dict[str, str]
    type_mapping: LanguageMapping
    address_mapping: LanguageMapping
    source_mapping: LanguageMapping
    rek_kdi_mapping: LanguageMapping
    status_mapping: LanguageMapping
    name_type_mapping: LanguageMapping
    register_mapping: LanguageMapping
    authority_mapping: LanguageMapping


# Logger setup
logger = logging.getLogger(__name__)

DEFAULT_MAPPINGS_KEY = "mappings"


class Mappings:
    """Class to manage and access mappings."""

    def __init__(self, mappings_file: str):
        """Initialize the Mappings class.

        Args:
            mappings_file (str): Path to the YAML mappings file.
        """
        self.mappings_file: str = mappings_file
        self.mappings: MappingsDict = self._load_mappings()

    def _load_mappings(self) -> MappingsDict:
        """Load mappings from the YAML file.

        Returns:
            MappingsDict: Parsed mappings data.

        Raises:
            FileNotFoundError: If the mappings file does not exist.
            KeyError: If the required mappings key is missing in the YAML file.
        """
        if not os.path.exists(self.mappings_file):
            raise FileNotFoundError(f"Mappings file not found: {self.mappings_file}")
        with open(self.mappings_file, "r", encoding="utf-8") as file:
            data = yaml.safe_load(file) or {}
            mappings = data.get(DEFAULT_MAPPINGS_KEY)
            if not mappings:
                raise KeyError(
                    f"'{DEFAULT_MAPPINGS_KEY}' not found in {self.mappings_file}"
                )
            logger.info(f"Loaded mappings: {list(mappings.keys())}")
            return mappings

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
            KeyError: If the mapping or language is not found.
        """
        mapping = self.mappings.get(mapping_name)
        if not mapping:
            raise KeyError(
                f"Mapping '{mapping_name}' not found in {self.mappings_file}."
            )

        # If the mapping is not language-specific, return it directly
        if not isinstance(mapping, dict):
            return mapping

        # Handle language-specific mappings
        if language and language in mapping:
            return mapping[language]
        elif language:
            raise KeyError(
                f"Language '{language}' not supported for mapping '{mapping_name}'."
            )

        return mapping

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
