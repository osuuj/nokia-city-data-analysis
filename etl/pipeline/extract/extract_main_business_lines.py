import logging
from typing import Any, Dict, List

from etl.config.mappings.dynamic_loader import load_toimi_mappings

logger = logging.getLogger(__name__)

# Load TOIMI mappings globally
toimi_mappings = load_toimi_mappings()


def extract_main_business_lines(
    data: List[Dict[str, Any]], lang: str
) -> List[Dict[str, Any]]:
    """Extracts main business line details from JSON data with type and source mappings.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        List[Dict[str, Any]]: Extracted main business line rows.
    """
    rows: List[Dict[str, Any]] = []

    try:
        # Validate the language code in TOIMI mappings
        if lang not in toimi_mappings["TOIMI"]:
            logger.error(f"Invalid language code: {lang}")
            return rows

        for company in data:
            business_id = company.get("businessId", {}).get("value")
            if not business_id:
                logger.debug("Skipping company with missing business ID.")
                continue

            main_business_line = company.get("mainBusinessLine", {})
            if not main_business_line:
                logger.debug(
                    f"No main business line found for businessId: {business_id}"
                )
                continue

            # Extract and map business line details
            raw_type = main_business_line.get("type", "")
            type_code_set = main_business_line.get("typeCodeSet", "TOIMI")

            # Fetch the appropriate mapping
            type_mapping = toimi_mappings.get(type_code_set, {}).get(lang, {})
            mapped_type = type_mapping.get(
                raw_type, raw_type
            )  # Default to raw if not found

            rows.append(
                {
                    "businessId": business_id,
                    "type": mapped_type,
                    "typeCodeSet": type_code_set,
                    "registrationDate": main_business_line.get("registrationDate", ""),
                    "source": main_business_line.get("source", ""),
                }
            )

        logger.info(f"Extracted {len(rows)} main business lines for language: {lang}")

    except KeyError as e:
        logger.error(f"KeyError in extract_main_business_lines: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_main_business_lines: {e}")

    return rows
