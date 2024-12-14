"""Extractor for Address Data.

This module defines the `AddressesExtractor` class, responsible for extracting and
processing address data from raw company records. It validates and cleans data
against mappings and handles missing values effectively.

Key Features:
- Maps address types and sources using configurable mappings.
- Cleans and standardizes numeric and string fields.
- Includes robust error handling and logging for incomplete data.
"""

import pandas as pd
from typing import Dict, List, Any
from etl.pipeline.extract.base_extractor import BaseExtractor
from etl.utils.cleaning_utils import clean_numeric_column


class AddressesExtractor(BaseExtractor):
    """Extractor class for the 'addresses' entity."""

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
        if not self.validate_language("address_mapping") or not self.validate_language(
            "source_mapping"
        ):
            raise ValueError(f"Invalid language code for the required mappings: {lang}")

        # Retrieve default country mapping
        self.default_country = self.mappings.get_mapping("default_country")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract address information.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted address records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(company)
        if not business_id:
            return results  # Skip if no business ID

        for address in company.get("addresses", []):
            try:
                # Map type, country, and source
                mapped_type = self.map_value(
                    address.get("type"),
                    self.mappings.get_mapping("address_mapping", self.lang),
                )
                mapped_source = self.map_value(
                    address.get("source"),
                    self.mappings.get_mapping("source_mapping", self.lang),
                )
                country = address.get("country", self.default_country)

                # Clean and map address data
                results.append(
                    {
                        "businessId": business_id,
                        "type": mapped_type,
                        "street": address.get("street", ""),
                        "buildingNumber": address.get("buildingNumber", ""),
                        "entrance": address.get("entrance", ""),
                        "apartmentNumber": clean_numeric_column(
                            address.get("apartmentNumber")
                        ),
                        "apartmentIdSuffix": address.get("apartmentIdSuffix", ""),
                        "postOfficeBox": address.get("postOfficeBox", ""),
                        "postCode": clean_numeric_column(address.get("postCode")),
                        "co": address.get("co", ""),
                        "country": country,
                        "freeAddressLine": address.get("freeAddressLine", ""),
                        "registrationDate": address.get("registrationDate", ""),
                        "source": mapped_source,
                    }
                )
            except Exception as e:
                self.logger.error(
                    f"Error processing address for businessId '{business_id}': {e}"
                )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process address data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed address data.
        """
        self.logger.info(f"Starting extraction for Addresses. Input rows: {len(data)}")
        if not data.empty:
            self.logger.debug(f"Sample input data: {data.head(5).to_dict()}")

        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
