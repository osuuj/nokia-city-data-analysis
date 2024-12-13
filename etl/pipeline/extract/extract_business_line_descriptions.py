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


def extract_business_line_descriptions(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extracts business line descriptions from JSON data.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Target language code (e.g., 'en', 'fi', 'sv').

    Returns:
        pd.DataFrame: Extracted business line description rows.
    """
    line_descriptions: List[Dict[str, Any]] = []
    skipped_records = 0

    # Load language code mapping
    language_code_mapping = mappings.get_mapping("language_code_mapping")

    for _, row in data.iterrows():
        company = row.to_dict()
        if not isinstance(company, dict):
            logger.error(f"Unexpected data type: {type(company)}. Expected dict.")
            skipped_records += 1
            continue

        business_id = get_business_id(company)
        if not business_id:
            logger.debug(f"Skipping company with missing businessId: {company}")
            skipped_records += 1
            continue

        main_business_line = company.get("mainBusinessLine")
        if not main_business_line:
            logger.debug(f"No mainBusinessLine found for businessId: {business_id}")
            continue

        descriptions = main_business_line.get("descriptions", [])
        for desc in descriptions:
            try:
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
                    line_descriptions.append(
                        {
                            "businessId": business_id,
                            "languageCode": mapped_lang,
                            "description": desc.get("description", ""),
                        }
                    )
            except KeyError as e:
                logger.error(f"Skipping record due to missing key: {e}")
                skipped_records += 1
            except Exception as e:
                logger.error(f"Unexpected error while processing record: {e}")
                skipped_records += 1

    logger.info(
        f"Processed {len(line_descriptions)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(line_descriptions)
