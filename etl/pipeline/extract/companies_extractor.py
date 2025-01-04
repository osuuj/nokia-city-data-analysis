"""Extractor for Company Data.

This module defines the `CompaniesExtractor` class, responsible for extracting and
processing data related to companies from raw input records. It validates data
against mappings and supports language-specific transformations.

Key Features:
- Dynamic mapping resolution for fields like trade register status.
- Handles nested fields like website URLs.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for skipped or invalid records.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor


class CompaniesExtractor(BaseExtractor):
    """Extractor class for the 'companies' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for mapping (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for required mappings.
        """
        super().__init__(mappings_file, lang)

        required_mappings = ["rek_kdi_mapping", "status_mapping"]
        for mapping in required_mappings:
            if not self.get_mapping(mapping):
                raise ValueError(
                    f"Required mapping '{mapping}' is missing in the mappings file."
                )

        self.rek_kdi_mapping = self.get_mapping("rek_kdi_mapping", lang)
        self.status_mapping = self.get_mapping("status_mapping", lang)

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract relevant data.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list containing a single extracted company record.
        """
        results: List[Dict[str, Any]] = []

        business_id = self.get_business_id(company)
        if not business_id:
            self.logger.debug("Skipping company without businessId.")
            return results

        try:
            trade_status = self.map_value(
                company.get("tradeRegisterStatus"), self.rek_kdi_mapping
            )
            status = self.map_value(company.get("status"), self.status_mapping)
            website = company.get("website")
            if isinstance(website, dict):
                website = website.get("url", "unknown")
            elif not website:
                website = "unknown"

            results.append(
                {
                    "businessId": business_id,
                    "website": website,
                    "CompanyIdStatus": status,
                    "tradeRegisterStatus": trade_status,
                    "registrationDate": self.parse_date(
                        company.get("registrationDate")
                    ),
                    "endDate": self.parse_date(company.get("endDate")),
                    "lastModified": self.parse_date(company.get("lastModified")),
                }
            )
        except Exception as e:
            self.logger.error(
                f"Error processing company {company.get('businessId', 'unknown')}: {e}"
            )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process company data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed company data.
        """
        self.logger.info(f"Starting extraction for Companies. Input rows: {len(data)}")

        return self.process_data(data)
