import logging
import pandas as pd
from typing import Any, Dict, List
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["config_files"]["mappings_file"]
mappings = Mappings(mappings_file)


def extract_company_situations(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extracts company situations from JSON data for a specific language.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        pd.DataFrame: Extracted company situation rows.
    """
    company_situations: List[Dict[str, Any]] = []
    skipped_records = 0

    # Retrieve type and source mappings for the specified language
    type_mapping = mappings.get_mapping("type_mapping", lang)
    source_mapping = mappings.get_mapping("source_mapping", lang)

    if not type_mapping or not source_mapping:
        logger.error(f"Invalid or missing mappings for language: {lang}")
        return pd.DataFrame(company_situations)

    for _, row in data.iterrows():
        company = row.to_dict()
        if not isinstance(company, dict):
            logger.error(f"Unexpected data type: {type(company)}. Expected dict.")
            skipped_records += 1
            continue

        business_id = get_business_id(company)
        if not business_id:
            logger.debug("Skipping company without businessId.")
            skipped_records += 1
            continue

        for situation in company.get("companySituations", []):
            try:
                # Map type
                raw_type = situation.get("type", "")
                mapped_type = type_mapping.get(raw_type, raw_type)

                # Map source
                raw_source = situation.get("source", None)
                mapped_source = source_mapping.get(raw_source, raw_source)

                company_situations.append(
                    {
                        "businessId": business_id,
                        "type": mapped_type,
                        "registrationDate": situation.get("registrationDate", ""),
                        "endDate": situation.get("endDate", None),
                        "source": mapped_source,
                    }
                )
            except KeyError as e:
                logger.error(f"Skipping record due to missing key: {e}")
                skipped_records += 1
            except Exception as e:
                logger.error(f"Unexpected error while processing record: {e}")
                skipped_records += 1

    logger.info(
        f"Processed {len(company_situations)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(company_situations)
