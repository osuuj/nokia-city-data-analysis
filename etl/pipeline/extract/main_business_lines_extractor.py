"""Extractor for Main Business Line Data.

This module defines the `MainBusinessLinesExtractor` class, responsible for extracting
and processing main business line data from raw company records. It utilizes TOIMI
mappings for type mapping and supports language-specific processing.

Key Features:
- Language-specific mappings using TOIMI mappings.
- Robust error handling and logging for incomplete or invalid data.
- Modular and reusable design for ETL pipelines.
"""

import pandas as pd
from typing import Dict, List, Any
from etl.pipeline.extract.base_extractor import BaseExtractor
from etl.config.mappings.dynamic_loader import DynamicLoader


class MainBusinessLinesExtractor(BaseExtractor):
    """Extractor class for the 'main_business_lines' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for TOIMI mappings.
        """
        super().__init__(mappings_file, lang)

        # Load and validate TOIMI mappings
        loader = DynamicLoader()
        self.toimi_mappings = loader.load_toimi_mappings()
        if lang not in self.toimi_mappings.get("TOIMI", {}):
            self.logger.error(f"Invalid language code for TOIMI mappings: {lang}")
            raise ValueError(f"Invalid language code for TOIMI mappings: {lang}")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract main business line information.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted main business line records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(company)
        if not business_id:
            return results  # Skip if no business ID

        main_business_line = company.get("mainBusinessLine", {})
        if not main_business_line:
            self.logger.debug(
                f"No main business line found for businessId: {business_id}"
            )
            return results

        try:
            # Extract and map type using TOIMI mappings
            raw_type = main_business_line.get("type", "")
            type_code_set = main_business_line.get("typeCodeSet", "TOIMI")
            type_mapping = self.toimi_mappings.get(type_code_set, {}).get(self.lang, {})
            mapped_type = self.map_value(raw_type, type_mapping)

            # Append the cleaned and mapped main business line data
            results.append(
                {
                    "businessId": business_id,
                    "type": mapped_type,
                    "typeCodeSet": type_code_set,
                    "registrationDate": main_business_line.get("registrationDate", ""),
                    "source": main_business_line.get("source", ""),
                }
            )
        except Exception as e:
            self.logger.error(
                f"Error processing main business line for businessId '{business_id}': {e}"
            )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process main business line data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed main business line data.
        """
        self.logger.info(
            f"Starting extraction for Main Business Lines. Input rows: {len(data)}"
        )
        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
