"""Base Extractor Module.

This module defines the BaseExtractor class, which serves as a base class for all entity-specific extractors.
It provides common functionality for processing and extracting data from DataFrames, validating language codes,
mapping values, and parsing dates. Subclasses must implement the `process_row` and `extract` methods.
"""

import logging
from typing import Any, Dict, List, Optional
import pandas as pd
from dateutil.parser import parse, ParserError
from etl.config.mappings.dynamic_loader import DynamicLoader, Mappings


class BaseExtractor:
    """Base class for all entity-specific extractors."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the BaseExtractor.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language abbreviation (e.g., "fi", "en", "sv").
        """
        self.logger = logging.getLogger("etl")
        self.mappings = Mappings(mappings_file)
        self.lang = lang
        self.dynamic_loader = DynamicLoader()

    def process_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Process and extract data from a DataFrame.

        Args:
            data (pd.DataFrame): The input raw data.

        Returns:
            pd.DataFrame: Extracted and processed data.
        """
        results: List[Dict[str, Any]] = []
        skipped_records = 0

        for index, row in data.iterrows():
            try:
                row_dict = row.to_dict()
                self.logger.debug(f"Processing row: {row_dict}")
                extracted_records = self.process_row(row_dict)
                if extracted_records:
                    results.extend(extracted_records)
                else:
                    skipped_records += 1
            except Exception as e:
                self.logger.error(f"Error processing row {index}: {e}")
                skipped_records += 1

        self.logger.info(
            f"Extraction completed. Processed {len(results)} records. Skipped {skipped_records} records."
        )
        return pd.DataFrame(results)

    def process_row(self, row: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Placeholder for row processing logic.

        Args:
            row (Dict[str, Any]): A single row of raw data.

        Returns:
            List[Dict[str, Any]]: Extracted records from the row.
        """
        raise NotImplementedError("Subclasses should implement this method")

    def get_business_id(self, company: Dict[str, Any]) -> Optional[str]:
        """Extract the business ID from a company record.

        Args:
            company (Dict[str, Any]): The company record.

        Returns:
            Optional[str]: The extracted business ID, or None if not found.
        """
        business_id = company.get("businessId", {}).get("value")
        if not business_id:
            self.logger.debug("Skipping company without businessId.")
            return None
        return business_id

    def validate_language(self, mapping_name: str) -> bool:
        """Validate that the language code is supported by the specified mapping.

        Args:
            mapping_name (str): Name of the mapping to validate.

        Returns:
            bool: True if the language is valid, False otherwise.
        """
        mapping = self.mappings.get_mapping(mapping_name)
        if self.lang not in mapping:
            self.logger.error(
                f"Invalid language: {self.lang} for mapping: {mapping_name}"
            )
            return False
        return True

    def map_value(self, raw_value: Any, mapping: Dict[str, Any]) -> Any:
        """Map a raw value using a mapping dictionary.

        Args:
            raw_value (Any): The value to map.
            mapping (Dict[str, Any]): The mapping dictionary.

        Returns:
            Any: The mapped value, or the raw value if no mapping exists.
        """
        self.logger.debug(f"Mapping value '{raw_value}' using mapping: {mapping}")
        return mapping.get(raw_value, raw_value)

    def parse_date(self, date_str: Optional[str]) -> Optional[str]:
        """Parse a date string and return it in a standard format.

        Args:
            date_str (Optional[str]): The date string to parse.

        Returns:
            Optional[str]: The parsed date in ISO format (YYYY-MM-DD), or None if parsing fails.
        """
        if not date_str:
            return None
        
        try:
 
            parsed_date = parse(date_str, fuzzy=True)
    
            return parsed_date.date().isoformat()
        except (ValueError, TypeError, ParserError) as e:
        
            self.logger.warning(f"Invalid date string '{date_str}': {e}")
            return None

    def filter_by_language_code(
        self,
        items: List[Dict[str, Any]],
        lang: str,
        language_code_mapping: Dict[str, str],
    ) -> List[Dict[str, Any]]:
        """Filter items based on the language code.

        Args:
            items (List[Dict[str, Any]]): List of dictionaries containing language-specific data.
            lang (str): Target language abbreviation (e.g., "fi", "en", "sv").
            language_code_mapping (Dict[str, str]): Mapping of language abbreviations to codes.

        Returns:
            List[Dict[str, Any]]: Filtered items matching the target language.
        """
        lang_code = language_code_mapping.get(lang)
        if not lang_code:
            self.logger.warning(f"Language code for '{lang}' not found in mapping.")
            return []

        return [item for item in items if item.get("language") == lang_code]

    def ensure_dict(self, value: Any) -> Dict[str, Any]:
        """Ensure the value is a dictionary.

        Args:
            value (Any): The value to check.

        Returns:
            Dict[str, Any]: The value if it is a dictionary, otherwise an empty dictionary.
        """
        if isinstance(value, dict):
            return value
        self.logger.error(f"Expected dict, got {type(value)}")
        return {}

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract data. Must be implemented by subclasses.

        Args:
            data (pd.DataFrame): DataFrame containing raw entity data.

        Returns:
            pd.DataFrame: Extracted and transformed data.
        """
        return pd.DataFrame()
