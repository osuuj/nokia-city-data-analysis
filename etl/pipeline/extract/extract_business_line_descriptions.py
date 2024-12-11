import logging
from typing import Any, Dict, List

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_business_line_descriptions(
    data: List[Dict[str, Any]], lang: str
) -> List[Dict[str, Any]]:
    """Extracts business line descriptions from JSON data.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Target language code (e.g., 'en', 'fi', 'sv').

    Returns:
        List[Dict[str, Any]]: Extracted business line description rows.
    """
    rows: List[Dict[str, Any]] = []

    try:
        # Load language code mapping
        language_code_mapping = mappings.get_mapping("language_code_mapping")

        if lang not in language_code_mapping:
            logger.error(f"Invalid language code: {lang}")
            return rows

        for company in data:
            business_id = company.get("businessId", {}).get("value")
            if not business_id:
                logger.debug(f"Skipping company with missing businessId: {company}")
                continue

            main_business_line = company.get("mainBusinessLine")
            if not main_business_line:
                logger.debug(f"No mainBusinessLine found for businessId: {business_id}")
                continue

            descriptions = main_business_line.get("descriptions", [])
            for desc in descriptions:
                # Extract raw language code and map it to a language abbreviation
                raw_language_code = desc.get("languageCode")

                # Reverse mapping: Convert numeric code back to language abbreviation
                mapped_lang = next(
                    (
                        key
                        for key, value in language_code_mapping.items()
                        if value == str(raw_language_code)
                    ),
                    None,
                )

                # Check if the mapped language matches the desired `lang`
                if mapped_lang == lang:
                    rows.append(
                        {
                            "businessId": business_id,
                            "languageCode": mapped_lang,
                            "description": desc.get("description", ""),
                        }
                    )
    except KeyError as e:
        logger.error(f"Missing key during business line description extraction: {e}")
    except Exception as e:
        logger.error(
            f"Unexpected error during business line description extraction: {e}"
        )

    return rows
