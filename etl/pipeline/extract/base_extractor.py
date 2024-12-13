import logging
from typing import Any, Dict, List, Optional
from dateutil.parser import parse
import pandas as pd
from etl.config.mappings.dynamic_loader import Mappings


class BaseExtractor:
    """Base class for all entity-specific extractors."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the BaseExtractor.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language abbreviation (e.g., "fi", "en", "sv").
        """
        self.logger = logging.getLogger(self.__class__.__name__)
        self.mappings = Mappings(mappings_file)
        self.lang = lang

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

    def map_value(self, raw_value: Any, mapping: Dict[Any, Any]) -> Any:
        """Map a raw value using a mapping dictionary.

        Args:
            raw_value (Any): The value to map.
            mapping (Dict[Any, Any]): The mapping dictionary.

        Returns:
            Any: The mapped value, or the raw value if no mapping exists.
        """
        return mapping.get(raw_value, raw_value)

    def parse_date(self, date_str: Optional[str]) -> Optional[str]:
        """Parse a date string and return it in a standard format.

        Args:
            date_str (Optional[str]): The date string to parse.

        Returns:
            Optional[str]: The parsed date string in ISO format, or None if invalid.
        """
        if not date_str:
            return None
        try:
            parsed_date = parse(date_str)
            return parsed_date.isoformat()
        except (ValueError, TypeError) as e:
            self.logger.error(f"Error parsing date: {date_str} - {e}")
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

    def clean_address_data(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Clean and standardize an address data row.

        Args:
            row (Dict[str, Any]): The address data row.

        Returns:
            Dict[str, Any]: The cleaned address data row.
        """
        if "apartmentNumber" in row:
            row["apartmentNumber"] = (
                str(row["apartmentNumber"]).replace(",", ".")
                if row["apartmentNumber"]
                else None
            )

        if "postCode" in row:
            row["postCode"] = (
                str(row["postCode"]).split(".")[0] if row["postCode"] else None
            )
        return row

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract data. Must be implemented by subclasses.

        Args:
            data (pd.DataFrame): DataFrame containing raw entity data.

        Returns:
            pd.DataFrame: Extracted and transformed data.

        Raises:
            NotImplementedError: If not implemented by subclasses.
        """
        raise NotImplementedError("Subclasses must implement the `extract` method.")
