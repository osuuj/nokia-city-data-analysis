import logging
import pandas as pd
from typing import Any, Dict, List
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.config.mappings.dynamic_loader import load_toimi_mappings

logger = logging.getLogger(__name__)

# Load TOIMI mappings globally
toimi_mappings = load_toimi_mappings()


def extract_main_business_lines(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extracts main business line details from JSON data with type and source mappings.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        pd.DataFrame: Extracted main business line rows.
    """
    business_lines: List[Dict[str, Any]] = []
    skipped_records = 0

    # Validate the language code in TOIMI mappings
    if lang not in toimi_mappings["TOIMI"]:
        logger.error(f"Invalid language code: {lang}")
        return pd.DataFrame(business_lines)

    for _, row in data.iterrows():
        company = row.to_dict()
        if not isinstance(company, dict):
            logger.error(f"Unexpected data type: {type(company)}. Expected dict.")
            skipped_records += 1
            continue

        business_id = company.get("businessId", {}).get("value")
        if not business_id:
            logger.debug("Skipping company with missing business ID.")
            skipped_records += 1
            continue

        main_business_line = company.get("mainBusinessLine", {})
        if not main_business_line:
            logger.debug(f"No main business line found for businessId: {business_id}")
            continue

        try:
            # Extract and map business line details
            raw_type = main_business_line.get("type", "")
            type_code_set = main_business_line.get("typeCodeSet", "TOIMI")

            # Fetch the appropriate mapping
            type_mapping = toimi_mappings.get(type_code_set, {}).get(lang, {})
            mapped_type = type_mapping.get(
                raw_type, raw_type
            )  # Default to raw if not found

            business_lines.append(
                {
                    "businessId": business_id,
                    "type": mapped_type,
                    "typeCodeSet": type_code_set,
                    "registrationDate": main_business_line.get("registrationDate", ""),
                    "source": main_business_line.get("source", ""),
                }
            )
        except KeyError as e:
            logger.error(f"Skipping record due to missing key: {e}")
            skipped_records += 1
        except Exception as e:
            logger.error(f"Unexpected error while processing record: {e}")
            skipped_records += 1

    logger.info(
        f"Processed {len(business_lines)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(business_lines)
