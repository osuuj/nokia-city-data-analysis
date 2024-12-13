import logging
import pandas as pd
from typing import Any, Dict, List
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id, map_value, validate_language

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["config_files"]["mappings_file"]
mappings = Mappings(mappings_file)


def extract_company_forms(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extracts company forms with source mapping.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Language abbreviation for mappings (e.g., "fi", "en", "sv").

    Returns:
        pd.DataFrame: Extracted rows with company forms.
    """
    company_forms: List[Dict[str, Any]] = []
    skipped_records = 0

    # Retrieve necessary mappings
    source_mapping = mappings.get_mapping("source_mapping")
    language_code_mapping = mappings.get_mapping("language_code_mapping")

    # Validate the language
    if not validate_language(lang, source_mapping, language_code_mapping):
        logger.error(f"Invalid language: {lang} for company forms.")
        return pd.DataFrame(company_forms)

    for _, row in data.iterrows():
        company = row.to_dict()
        if not isinstance(company, dict):
            logger.error(f"Unexpected data type: {type(company)}. Expected dict.")
            skipped_records += 1
            continue

        business_id = get_business_id(company)
        if not business_id:
            logger.debug("Skipping company with missing business ID.")
            skipped_records += 1
            continue

        for form in company.get("companyForms", []):
            try:
                company_forms.append(
                    {
                        "businessId": business_id,
                        "type": form.get("type", ""),
                        "registrationDate": form.get("registrationDate", ""),
                        "endDate": form.get("endDate", None),
                        "version": form.get("version", 0),
                        "source": map_value(form.get("source", None), source_mapping),
                    }
                )
            except KeyError as e:
                logger.error(f"Skipping record due to missing key: {e}")
                skipped_records += 1
            except Exception as e:
                logger.error(f"Unexpected error while processing record: {e}")
                skipped_records += 1

    logger.info(
        f"Processed {len(company_forms)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(company_forms)
