import logging

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_registered_entry_descriptions(data, lang):
    """
    Extracts registered entry descriptions filtered by language.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for filtering ("fi", "sv", "en").

    Returns:
        list: Extracted registered entry description rows.
    """
    language_code_mapping = mappings.get_mapping("language_code_mapping")
    rows = []

    # Ensure `lang` is valid
    if lang not in language_code_mapping:
        logger.error(f"Invalid language code: {lang}")
        return rows

    for company in data:
        business_id = company.get("businessId", {}).get("value", None)
        if not business_id:
            logger.warning("Skipping company without businessId.")
            continue  # Skip if no businessId

        for entry in company.get("registeredEntries", []):
            descriptions = entry.get("descriptions", [])
            for desc in descriptions:
                # Map raw language code back to language abbreviation
                raw_language_code = desc.get("languageCode", None)
                mapped_lang = next(
                    (
                        key
                        for key, value in language_code_mapping.items()
                        if value == str(raw_language_code)
                    ),
                    None,
                )

                if mapped_lang == lang:
                    rows.append(
                        {
                            "businessId": business_id,
                            "entryType": entry.get("type", ""),  # Keep raw type value
                            "description": desc.get("description", ""),
                        }
                    )

    logger.info(
        f"Extracted {len(rows)} registered entry descriptions for language: {lang}"
    )
    return rows
