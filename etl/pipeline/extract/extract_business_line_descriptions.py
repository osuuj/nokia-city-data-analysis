import logging
from etl.config.mappings import language_code_mapping

logger = logging.getLogger(__name__)

def extract_business_line_descriptions(data, lang):
    """
    Extracts business line descriptions from JSON data.

    Args:
        data (list): List of company data.
        lang (str): Target language code (e.g., 'en', 'fi', 'sv').

    Returns:
        list: Extracted business line description rows.
    """
    rows = []

    # Ensure `lang` is valid
    if lang not in language_code_mapping:
        logger.error(f"Invalid language code: {lang}")
        return rows

    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId

        main_business_line = company.get('mainBusinessLine')
        if main_business_line is None:
            continue  # Skip if no mainBusinessLine

        descriptions = main_business_line.get('descriptions', [])
        for desc in descriptions:
            # Extract raw language code and map it to a language abbreviation
            raw_language_code = desc.get('languageCode', None)

            # Reverse mapping: Convert numeric code back to language abbreviation
            mapped_lang = next(
                (key for key, value in language_code_mapping.items() if value == str(raw_language_code)),
                None
            )

            # Check if the mapped language matches the desired `lang`
            if mapped_lang == lang:
                rows.append({
                    "businessId": business_id,
                    "languageCode": mapped_lang,
                    "description": desc.get('description', '')
                })
    return rows
