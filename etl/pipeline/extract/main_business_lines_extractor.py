"""Extractor for Main Business Lines Data.

This module defines the `MainBusinessLinesExtractor` class, responsible for extracting and
processing main business line data from raw company records. It validates data against
mappings and supports language-specific transformations.

Key Features:
- Dynamic mapping resolution for fields like industry codes.
- Handles nested fields like source mappings.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for skipped or invalid records.
"""

from typing import Any, Dict, List, Tuple

import pandas as pd

from etl.config.mappings.dynamic_loader import DynamicLoader
from etl.pipeline.extract.base_extractor import BaseExtractor


class MainBusinessLinesExtractor(BaseExtractor):
    """Extractor class for the 'main_business_lines' entity."""

    def __init__(self, mappings_file: str, lang: str) -> None:
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for TOIMI mappings.
            KeyError: If the TOIMI mappings are not found in the mappings file.
        """
        super().__init__(mappings_file, lang)
        self.dynamic_loader = DynamicLoader()
        self.source_mapping = self.get_mapping("source_mapping")
        self.industry_2025_mapping = self.dynamic_loader.load_industry_2025_mapping()

    def process_row(self, row: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract main business line information.

        Args:
            row (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted main business line records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(row)
        if not business_id:
            self.logger.warning("Skipping record with missing businessId.")
            return results

        main_business_line = row.get("mainBusinessLine")
        if not isinstance(main_business_line, dict):
            self.logger.warning(
                f"Expected 'mainBusinessLine' to be a dictionary, got {type(main_business_line)}"
            )
            return results

        type_code_set = main_business_line.get("typeCodeSet")
        type_code = main_business_line.get("type")
        if not type_code_set or not type_code:
            self.logger.warning(
                f"Missing 'typeCodeSet' or 'type' in mainBusinessLine for businessId: {business_id}"
            )
            return results

        try:
            mapping = self.dynamic_loader.load_toimi_mapping(type_code_set, self.lang)
            mapped_name = mapping.get(type_code, "")
            source = main_business_line.get("source")
            mapped_source = (
                self.map_value(source, self.source_mapping) if source else None
            )

            # Extract industry 2025 title
            industry_title, industry_letter = self.get_industry_title(type_code)

            results.append(
                {
                    "business_id": business_id,
                    "industryCode": type_code,
                    "industryLetter": industry_letter,
                    "industry": industry_title,
                    "industryDescription": mapped_name,
                    "registrationDate": self.parse_date(
                        main_business_line.get("registrationDate", "")
                    ),
                    "source": mapped_source,
                }
            )
        except Exception as e:
            self.logger.error(
                f"Error processing main business line for businessId '{business_id}': {e}"
            )

        return results

    def get_industry_title(self, type_code: str) -> Tuple[str, str]:
        """Get the industry title based on the type code and language.

        Args:
            type_code (str): The industry type code.

        Returns:
            str: The industry title in the specified language.
        """
        industry_title = ""
        industry_letter = ""
        lang_column = self.lang

        if type_code in self.industry_2025_mapping:
            category = self.industry_2025_mapping[type_code]["category"]
            for tol_code, data in self.industry_2025_mapping.items():
                if tol_code == category:
                    industry_title = data[lang_column]
                    industry_letter = category
                    break

        return industry_title, industry_letter

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
        return self.process_data(data)
