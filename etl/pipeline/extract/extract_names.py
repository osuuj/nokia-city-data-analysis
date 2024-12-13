import logging
import pandas as pd
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id, map_value

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["config_files"]["mappings_file"]
mappings = Mappings(mappings_file)


def extract_names(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extracts names of companies and maps their types.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Language abbreviation for mappings (e.g., "fi", "en", "sv").

    Returns:
        pd.DataFrame: Extracted rows with company names and types.
    """
    names = []
    skipped_records = 0

    # Load required mappings
    name_type_mapping = mappings.get_mapping("name_type_mapping", lang)
    source_mapping = mappings.get_mapping("source_mapping", lang)

    for _, company in data.iterrows():
        business_id = get_business_id(company)
        if not business_id:
            logger.debug("Skipping company with missing businessId.")
            skipped_records += 1
            continue

        for name in company.get("names", []):
            try:
                # Map type and source
                mapped_type = map_value(name.get("type", ""), name_type_mapping)
                mapped_source = map_value(name.get("source", ""), source_mapping)

                # Append the processed name data
                names.append(
                    {
                        "businessId": business_id,
                        "name": name.get("name", ""),
                        "type": mapped_type,
                        "registrationDate": name.get("registrationDate", ""),
                        "endDate": name.get("endDate", ""),
                        "version": name.get("version", 0),
                        "source": mapped_source,
                    }
                )
            except KeyError as e:
                logger.error(f"Skipping record due to missing key: {e}")
                skipped_records += 1
            except Exception as e:
                logger.error(f"Unexpected error while processing record: {e}")
                skipped_records += 1

    logger.info(f"Processed {len(names)} records. Skipped {skipped_records} records.")
    return pd.DataFrame(names)
