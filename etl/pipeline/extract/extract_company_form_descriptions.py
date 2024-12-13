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


def extract_company_form_descriptions(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extracts company form descriptions from JSON data for a specific language.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Language abbreviation to filter descriptions ("fi", "sv", "en").

    Returns:
        pd.DataFrame: Extracted company form descriptions for the specified language.
    """
    form_descriptions: List[Dict[str, Any]] = []
    skipped_records = 0

    # Load language code mapping
    language_code_mapping = mappings.get_mapping("language_code_mapping")

    if lang not in language_code_mapping:
        logger.error(f"Invalid language code: {lang}")
        return pd.DataFrame(form_descriptions)

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

        for form in company.get("companyForms", []):
            descriptions = form.get("descriptions", [])
            for desc in descriptions:
                try:
                    # Map the raw language code back to the language abbreviation
                    raw_language_code = desc.get("languageCode")
                    mapped_lang = next(
                        (
                            key
                            for key, value in language_code_mapping.items()
                            if value == str(raw_language_code)
                        ),
                        None,
                    )

                    # Append data if the language matches
                    if mapped_lang == lang:
                        form_descriptions.append(
                            {
                                "businessId": business_id,
                                "type": form.get("type", ""),  # Preserve raw type value
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
        f"Processed {len(form_descriptions)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(form_descriptions)
