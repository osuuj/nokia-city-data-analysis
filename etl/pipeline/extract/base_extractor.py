"""Base Extractor Module.

This module defines the BaseExtractor class, which serves as a base class for all entity-specific extractors.
It provides common functionality for processing and extracting data from DataFrames, validating language codes,
mapping values, and parsing dates. Subclasses must implement the `process_row` and `extract` methods.
"""

import logging
from typing import Any, Dict, List, Optional

import pandas as pd
from dateutil.parser import parse, ParserError
from etl.config.mappings.dynamic_loader import Mappings


class BaseExtractor:
    """Base class for all entity-specific extractors."""

    def __init__(self, mappings_file: str, lang: str) -> None:
        """Initialize the BaseExtractor.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language abbreviation (e.g., "fi", "en", "sv").
        """
        self.logger = logging.getLogger("etl")
        self.mappings = Mappings(mappings_file)
        self.lang = lang

    def process_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Process and extract data from a DataFrame.

        Args:
            data (pd.DataFrame): The input raw data.

        Returns:
            pd.DataFrame: Extracted and processed data.
        """
        results: List[Dict[str, Any]] = []
        skipped_records = 0

        for _, row in data.iterrows():
            row_dict = row.to_dict()
            processed_rows = self.process_row(row_dict)
            if processed_rows:
                results.extend(processed_rows)
            else:
                skipped_records += 1

        self.logger.info(
            f"Extraction completed. Processed {len(results)} records. Skipped {skipped_records} records."
        )
        return pd.DataFrame(results)

    def process_row(self, row: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single row of data.

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
        self.logger.debug(f"Extracting business ID from company: {company} (type: {type(company)})")
        if not isinstance(company, dict):
            self.logger.warning(f"Company is not a dictionary: {company}")
            return None

        business_id = company.get("businessId", {}).get("value") if company.get("businessId") else None
        if not business_id:
            self.logger.warning(f"Business ID not found in company: {company}")
        return business_id

    def get_mapping(self, mapping_name: str, language: Optional[str] = None) -> Any:
        """Retrieve a specific mapping by name and optionally filter by language.

        Args:
            mapping_name (str): The name of the mapping to retrieve.
            language (Optional[str]): The language to filter the mapping by.

        Returns:
            Any: The requested mapping.

        Raises:
            KeyError: If the mapping does not exist.
        """
        self.logger.debug(f"Retrieving mapping '{mapping_name}' for language '{language or self.lang}'")
        mapping = self.mappings.get_mapping(mapping_name, language or self.lang)
        self.logger.debug(f"Retrieved mapping '{mapping_name}': {mapping} (type: {type(mapping)})")
        return mapping

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
        """Parse a date string and return the date part in ISO format.

        Args:
            date_str (Optional[str]): The date string to parse.

        Returns:
            Optional[str]: The parsed date in ISO format (YYYY-MM-DD), or None if parsing fails.
        """
        self.logger.debug(f"Parsing date string: {date_str}")
        
        if not date_str:
            return None
        
        try:
            parsed_date = parse(date_str, fuzzy=True)
            return parsed_date.date().isoformat()
        except (ValueError, TypeError, ParserError) as e:
            self.logger.warning(f"Invalid date string '{date_str}': {e}")
            return None

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw records.

        Returns:
            pd.DataFrame: Extracted and processed data.
        """
        raise NotImplementedError("Subclasses should implement this method")

    def validate_language(self, mapping_name: str) -> bool:
        """Validate if a language code exists in the mapping.

        Args:
            mapping_name (str): Name of the mapping to validate.

        Returns:
            bool: True if the language code is valid, False otherwise.
        """
        return self.lang in self.mappings.get_mapping(mapping_name)
