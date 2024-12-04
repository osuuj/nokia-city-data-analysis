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
        logger.error(f"Invalid language code: {lang}")
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
