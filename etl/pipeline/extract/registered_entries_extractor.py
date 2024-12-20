"""Extractor for Registered Entry Data.

This module defines the `RegisteredEntriesExtractor` class, responsible for extracting
and processing registered entry data from raw company records. It validates data
against mappings and supports language-specific transformations.

Key Features:
- Dynamic mapping resolution for register and authority fields.
- Language validation for mappings using a centralized mechanism.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for skipped or invalid records.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor


class RegisteredEntriesExtractor(BaseExtractor):
    """Extractor class for the 'registered_entries' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for mapping (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for required mappings.
        """
        super().__init__(mappings_file, lang)

        # Validate required mappings
        if not self.validate_language("register_mapping"):
            raise ValueError("Invalid language for register_mapping.")
        if not self.validate_language("authority_mapping"):
            raise ValueError("Invalid language for authority_mapping.")

        # Load mappings
        self.register_mapping = self.mappings.get_mapping("register_mapping", lang)
        self.authority_mapping = self.mappings.get_mapping("authority_mapping", lang)

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract registered entry information.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted registered entry records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(company)
        if not business_id:
            return results  # Skip if no business ID

        for entry in company.get("registeredEntries", []):
            try:
                mapped_register = self.map_value(
                    entry.get("register", None), self.register_mapping
                )
                mapped_authority = self.map_value(
                    entry.get("authority", None), self.authority_mapping
                )

                results.append(
                    {
                        "businessId": business_id,
                        "type": entry.get("type", ""),
                        "registrationDate": self.parse_date(
                            entry.get("registrationDate", None)
                        ),
                        "endDate": self.parse_date(entry.get("endDate", None)),
                        "register": mapped_register,
                        "authority": mapped_authority,
                    }
                )
            except Exception as e:
                self.logger.error(
                    f"Unexpected error while processing registered entry: {e}"
                )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process registered entry data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed registered entry data.
        """
        self.logger.info(
            f"Starting extraction for Registered Entries. Input rows: {len(data)}"
        )
        if not data.empty:
            self.logger.debug(f"Sample input data: {data.head(5).to_dict()}")

        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
