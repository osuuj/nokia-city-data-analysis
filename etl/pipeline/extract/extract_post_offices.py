import logging
import pandas as pd
from typing import Any, Dict, List
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["config_files"]["mappings_file"]
mappings = Mappings(mappings_file)


def extract_post_offices(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extracts post office details from JSON data, filtering by languageCode.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Language abbreviation ("fi", "sv", "en").

    Returns:
        pd.DataFrame: Extracted post office rows filtered by the specified language.
    """
    post_offices: List[Dict[str, Any]] = []
    skipped_records = 0

    # Load the post office language code mapping
    post_office_language_code = mappings.get_mapping("post_office_language_code")

    # Get the numeric language code for the specified language
    lang_code = post_office_language_code.get(lang)
    if lang_code is None:
        logger.error(f"Invalid language code: {lang}")
        return pd.DataFrame(post_offices)

    for _, row in data.iterrows():
        company = row.to_dict()
        if not isinstance(company, dict):
            logger.error(f"Unexpected data type: {type(company)}. Expected dict.")
            skipped_records += 1
            continue

        business_id = company.get("businessId", {}).get("value")
        if not business_id:
            logger.debug("Skipping company without businessId.")
            skipped_records += 1
            continue

        for address in company.get("addresses", []):
            for post_office in address.get("postOffices", []):
                try:
                    # Check if the languageCode matches the target lang_code
                    if str(post_office.get("languageCode")) == lang_code:
                        post_offices.append(
                            {
                                "businessId": business_id,
                                "postCode": post_office.get("postCode", ""),
                                "city": post_office.get("city", ""),
                                "active": post_office.get("active", False),
                                "languageCode": lang,  # Store as the original language string
                                "municipalityCode": post_office.get(
                                    "municipalityCode", ""
                                ),
                            }
                        )
                except KeyError as e:
                    logger.error(f"Skipping record due to missing key: {e}")
                    skipped_records += 1
                except Exception as e:
                    logger.error(f"Unexpected error while processing record: {e}")
                    skipped_records += 1

    logger.info(
        f"Processed {len(post_offices)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(post_offices)
