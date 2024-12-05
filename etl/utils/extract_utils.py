"""
Utility functions for shared extraction and transformation tasks.
"""
import logging

logger = logging.getLogger(__name__)

def get_business_id(company):
    """Safely extract the business ID from a company record."""
    return company.get('businessId', {}).get('value', None)

def validate_language(lang, mapping):
    """Validate if a language code exists in the mapping."""
    if lang not in mapping:
        logger.error(f"Invalid language code: {lang}. Available languages: {list(mapping.keys())}")
        return False
    return True

def map_value(raw_value, mapping):
    """Map a raw value using a language-specific mapping."""
    return mapping.get(raw_value, raw_value)

def clean_address_data(row):
    """
    Clean and standardize an address data row.
    """
    # Clean apartmentNumber (e.g., replace commas with periods)
    if "apartmentNumber" in row:
        row["apartmentNumber"] = (
            str(row["apartmentNumber"]).replace(",", ".") if row["apartmentNumber"] else None
        )

    # Convert postCode to string and remove decimals
    if "postCode" in row:
        row["postCode"] = (
            str(row["postCode"]).split(".")[0] if row["postCode"] else None
        )
    return row

def filter_by_language_code(items, lang, language_code_mapping):
    """
    Filters items based on the language code.

    Args:
        items (list): List of dictionaries containing language-specific data.
        lang (str): Target language abbreviation (e.g., "fi", "en", "sv").
        language_code_mapping (dict): Mapping of language abbreviations to codes.

    Returns:
        list: Filtered items matching the target language.
    """
    lang_code = language_code_mapping.get(lang)
    if not lang_code:
        logger.warning(f"Language code for '{lang}' not found in mapping.")
        return []

    return [item for item in items if item.get('language') == lang_code]
