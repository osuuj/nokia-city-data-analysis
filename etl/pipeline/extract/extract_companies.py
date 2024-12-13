import logging
import pandas as pd
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import map_value, get_business_id

# Configure logging
logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["config_files"]["mappings_file"]
mappings = Mappings(mappings_file)


def extract_companies(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extract and flatten company data for the 'companies' table using mappings.

    Args:
        data (pd.DataFrame): DataFrame containing raw company data.
        lang (str): Language code for mapping (e.g., 'en', 'fi', 'sv').

    Returns:
        pd.DataFrame: Extracted and flattened company data formatted for the companies table.
    """
    companies = []
    skipped_records = 0

    # Retrieve necessary mappings
    rek_kdi_mapping = mappings.get_mapping("rek_kdi_mapping", lang)
    status_mapping = mappings.get_mapping("status_mapping", lang)

    for _, row in data.iterrows():
        company = row.to_dict()
        if not isinstance(company, dict):
            logger.error(f"Unexpected data type: {type(company)}. Expected dict.")
            skipped_records += 1
            continue

        try:
            business_id = get_business_id(company)
            if not business_id:
                skipped_records += 1
                logger.debug("Skipping company without businessId.")
                continue

            trade_status = map_value(
                company.get("tradeRegisterStatus", ""), rek_kdi_mapping
            )
            status = map_value(company.get("status", ""), status_mapping)
            website = company.get("website", "unknown")
            if isinstance(website, dict):
                website = website.get("url", "unknown")
            elif not website:
                website = "unknown"

            companies.append(
                {
                    "businessId": business_id,
                    "website": website,
                    "registrationDate": company.get("registrationDate", ""),
                    "tradeRegisterStatus": trade_status,
                    "status": status,
                    "endDate": company.get("endDate", ""),
                    "lastModified": company.get("lastModified", ""),
                }
            )
        except KeyError as e:
            logger.error(f"Skipping record due to missing key: {e}")
        except Exception as e:
            logger.error(f"Unexpected error while processing record: {e}")

    logger.info(
        f"Processed {len(companies)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(companies)
