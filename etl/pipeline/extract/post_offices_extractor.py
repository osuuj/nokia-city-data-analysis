"""Extractor for Post Office Data.

This module defines the `PostOfficesExtractor` class, responsible for extracting and
processing data related to post offices from raw company records. It validates data
against mappings and supports language-specific filtering.

Key Features:
- Language-specific filtering for post office records.
- Error handling and logging for invalid or incomplete data.
- Modular class-based design for reusability in ETL pipelines.
"""

import pandas as pd
from typing import Dict, List, Any
from etl.pipeline.extract.base_extractor import BaseExtractor


class PostOfficesExtractor(BaseExtractor):
    """Extractor class for the 'post_offices' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid.
        """
        super().__init__(mappings_file, lang)

        # Retrieve the language code from the mappings
        post_office_language_code = self.mappings.get_mapping(
            "post_office_language_code"
        )
        self.lang_code = post_office_language_code.get(lang)

        if not self.lang_code:
            self.logger.error(f"Invalid language code: {lang}")
            raise ValueError(f"Invalid language code: {lang}")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract post office information.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted post office records.
        """
        results: List[Dict[str, Any]] = []
        try:
            business_id = self.get_business_id(company)
            if not business_id:
                return results  # Skip if no business ID

            # Extract addresses containing post office data
            addresses = company.get("addresses", [])
            for address in addresses:
                post_offices = address.get("postOffices", [])
                for post_office in post_offices:
                    # Check for matching language code
                    language_code = str(post_office.get("languageCode"))
                    if language_code == self.lang_code:
                        results.append(
                            {
                                "businessId": business_id,
                                "postCode": post_office.get("postCode", ""),
                                "city": post_office.get("city", ""),
                                "active": post_office.get("active", False),
                                "languageCode": self.lang,  # Use the language string
                                "municipalityCode": post_office.get(
                                    "municipalityCode", ""
                                ),
                            }
                        )
        except Exception as e:
            self.logger.error(
                f"Error processing row with businessId '{company.get('businessId', 'unknown')}': {e}"
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
