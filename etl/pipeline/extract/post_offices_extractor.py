"""Extractor for Post Offices.

This module defines the `PostOfficesExtractor` class, responsible for extracting and
processing post office data from raw company records. It validates and cleans data
against mappings and handles missing values effectively.

Key Features:
- Extracts and maps post office-related information.
- Validates data integrity and consistency.
- Includes robust error handling and logging.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor
from etl.utils.cleaning_utils import clean_numeric_column


class PostOfficesExtractor(BaseExtractor):
    """Extractor class for the 'post_offices' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid or required mappings are missing.
        """
        super().__init__(mappings_file, lang)

        # Validate that required mappings exist for the language
        if not self.validate_language("post_office_mapping"):
            raise ValueError(f"Invalid language code for the required mappings: {lang}")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract post office information.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted post office records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(company)
        if not business_id:
            return results  # Skip if no business ID

        if not isinstance(company, dict):
            self.logger.error(f"Invalid company record: {company}")
            return results

        addresses = company.get("addresses", [])
        if not isinstance(addresses, list):
            self.logger.warning(
                f"Expected 'addresses' to be a list, got {type(addresses)}"
            )
            return results

        for address in addresses:
            try:
                mapped_type = self.map_value(
                    address.get("type"),
                    self.mappings.get_mapping("post_office_mapping", self.lang),
                )

                results.append(
                    {
                        "business_id": business_id,
                        "post_code": clean_numeric_column(address.get("postCode")),
                        "city": address.get("city", ""),
                        "municipality_code": clean_numeric_column(
                            address.get("municipalityCode")
                        ),
                        "type": mapped_type,
                        "active": address.get("active", True),
                    }
                )
            except Exception as e:
                self.logger.error(
                    f"Error processing address for businessId '{business_id}': {e}"
                )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process post office data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed post office data.
        """
        self.logger.info(
            f"Starting extraction for Post Offices. Input rows: {len(data)}"
        )
        if not data.empty:
            self.logger.debug(f"Sample input data: {data.head(5).to_dict()}")

        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
