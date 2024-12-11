import datetime
import logging
from typing import Any, Dict, List

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG.get("config_files", {}).get("mappings_file")
mappings = Mappings(mappings_file)


def extract_companies(data: List[Dict[str, Any]], lang: str) -> List[Dict[str, Any]]:
    """Extracts company details from JSON data for a specific language.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        List[Dict[str, Any]]: Extracted company rows.
    """
    rows: List[Dict[str, Any]] = []

    try:
        # Retrieve necessary mappings
        type_mapping = mappings.get_mapping("type_mapping", lang)
        source_mapping = mappings.get_mapping("source_mapping", lang)

        if not type_mapping or not source_mapping:
            logger.error(f"Invalid or missing mappings for language: {lang}")
            return rows

        for company in data:
            business_id = get_business_id(company)
            if not business_id:
                logger.debug("Skipping company without businessId.")
                continue

            # Extract and map company details
            raw_type = company.get("type", "")
            mapped_type = type_mapping.get(raw_type, raw_type)

            raw_source = company.get("source", None)
            mapped_source = source_mapping.get(raw_source, raw_source)

            rows.append(
                {
                    "businessId": business_id,
                    "type": mapped_type,
                    "registrationDate": company.get(
                        "registrationDate", datetime.datetime.now().date()
                    ),
                    "endDate": company.get("endDate", None),
                    "source": mapped_source,
                }
            )

        logger.info(f"Extracted {len(rows)} companies for language: {lang}")

    except KeyError as e:
        logger.error(f"KeyError in extract_companies: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_companies: {e}")

    return rows
