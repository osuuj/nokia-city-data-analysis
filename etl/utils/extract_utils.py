"""Utility functions for shared extraction and transformation tasks.

This module provides functions for extracting, validating, mapping, and 
filtering data used across the ETL pipeline. These utilities support 
language-specific transformations and address data cleaning.
"""

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


def get_business_id(company: Dict[str, Any]) -> Optional[str]:
    """Extract the business ID from a company record.

    Args:
        company (Dict[str, Any]): The company record.

    Returns:
        Optional[str]: The extracted business ID, or None if not found.
    """
    return company.get("businessId", {}).get("value")


def validate_language(
    lang: str, mapping: Dict[str, Any], language_code_mapping: Dict[str, str]
) -> bool:
    """Validate if a language code exists in the mapping.

    Args:
        lang (str): Language abbreviation (e.g., "fi", "en", "sv").
        mapping (Dict[str, Any]): The mapping to validate against.
        language_code_mapping (Dict[str, str]): Mapping of language abbreviations to numerical codes.

    Returns:
        bool: True if the language code exists, False otherwise.
    """
    lang_code = language_code_mapping.get(lang)
    if not lang_code:
        logger.warning(
            f"Language code '{lang}' not found in language_code_mapping: {language_code_mapping}"
        )
        return False

    if str(lang) in mapping or lang_code in mapping:
        return True

    logger.warning(
        f"Language code '{lang}' ({lang_code}) not found in mapping keys: {list(mapping.keys())}"
    )
    return False


def map_value(raw_value: Any, mapping: Dict[Any, Any]) -> Any:
    """Map a raw value using a mapping dictionary.

    Args:
        raw_value (Any): The value to map.
        mapping (Dict[Any, Any]): The mapping dictionary.

    Returns:
        Any: The mapped value, or the raw value if no mapping exists.
    """
    return mapping.get(raw_value, raw_value)


def clean_address_data(row: Dict[str, Any]) -> Dict[str, Any]:
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


def filter_by_language_code(
    items: List[Dict[str, Any]], lang: str, language_code_mapping: Dict[str, str]
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
        logger.warning(f"Language code for '{lang}' not found in mapping.")
        return []

    return [item for item in items if item.get("language") == lang_code]
