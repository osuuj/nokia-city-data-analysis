"""Extractor for Address Data.

This module defines the `AddressesExtractor` class, responsible for extracting and
processing address data from raw company records. It validates and maps data
against configurations and logs incomplete data.

Key Features:
- Maps address types and sources using configurable mappings.
- Includes robust error handling and logging for incomplete data.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor


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

        self.address_mapping = self.get_mapping("address_mapping")
        self.source_mapping = self.get_mapping("source_mapping")
        self.default_country = self.get_mapping("default_country")

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
            self.logger.warning("Skipping record with missing businessId.")
            return results

        for address in company.get("addresses", []):
            try:
                mapped_type = self.map_value(address.get("type"), self.address_mapping)
                mapped_source = self.map_value(address.get("source"), self.source_mapping)
                country = address.get("country", self.default_country)

                results.append({
                    "businessId": business_id,
                    "type": mapped_type,
                    "street": address.get("street", ""),
                    "buildingNumber": address.get("buildingNumber", ""),
                    "entrance": address.get("entrance", ""),
                    "apartmentNumber": address.get("apartmentNumber", ""),
                    "apartmentIdSuffix": address.get("apartmentIdSuffix", ""),
                    "postOfficeBox": address.get("postOfficeBox", ""),
                    "postCode": address.get("postCode", ""),
                    "co": address.get("co", ""),
                    "country": country,
                    "freeAddressLine": address.get("freeAddressLine", ""),
                    "registrationDate": self.parse_date(address.get("registrationDate", "")),
                    "source": mapped_source,
                })
            except Exception as e:
                self.logger.error(f"Error processing address for businessId '{business_id}': {e}")
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process address data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed address data.
        """
        self.logger.info(f"Starting extraction for Addresses. Input rows: {len(data)}")
        return self.process_data(data)
