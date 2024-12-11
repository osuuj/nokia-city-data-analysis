import logging
from typing import Any, Dict, List

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id, map_value

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_names(data: List[Dict[str, Any]], lang: str) -> List[Dict[str, Any]]:
    """Extracts names of companies and maps their types.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Language abbreviation for mappings (e.g., "fi", "en", "sv").

    Returns:
        List[Dict[str, Any]]: Extracted rows with company names and types.
    """
    rows = []

    try:
        # Load required mappings
        name_type_mapping = mappings.get_mapping("name_type_mapping", lang)
        source_mapping = mappings.get_mapping("source_mapping", lang)

        for company in data:
            business_id = get_business_id(company)
            if not business_id:
                logger.debug("Skipping company with missing businessId.")
                continue

            for name in company.get("names", []):
                # Map type and source
                mapped_type = map_value(name.get("type", ""), name_type_mapping)
                mapped_source = map_value(name.get("source", ""), source_mapping)

                # Append the processed name data
                rows.append(
                    {
                        "businessId": business_id,
                        "name": name.get("name", ""),
                        "type": mapped_type,
                        "registrationDate": name.get("registrationDate", ""),
                        "endDate": name.get("endDate", None),
                        "version": name.get(
                            "version", 0
                        ),  # Ensure default version is 0
                        "source": mapped_source,
                    }
                )

        logger.info(f"Extracted {len(rows)} names for language: {lang}")

    except KeyError as e:
        logger.error(f"KeyError in extract_names: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_names: {e}")

    return rows
