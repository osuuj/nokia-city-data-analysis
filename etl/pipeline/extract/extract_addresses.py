import logging
import pandas as pd
from typing import Any, Dict, List
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.cleaning_utils import clean_numeric_column
from etl.utils.extract_utils import get_business_id, map_value

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["config_files"]["mappings_file"]
mappings = Mappings(mappings_file)


def extract_addresses(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extract and clean address details from company data.

    Args:
        data (pd.DataFrame): The company data to process.
        lang (str): Language abbreviation for mappings.

    Returns:
        pd.DataFrame: Extracted and cleaned address rows.
    """
    addresses: List[Dict[str, Any]] = []
    skipped_records = 0

    # Load mappings dynamically
    address_mapping = mappings.get_mapping("address_mapping", lang)
    source_mapping = mappings.get_mapping("source_mapping", lang)
    default_country = mappings.get_mapping("default_country")

    if not address_mapping or not source_mapping:
        logger.error(f"Invalid language or missing mappings for: {lang}")
        return pd.DataFrame(addresses)

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

        for address in company.get("addresses", []):
            try:
                # Map type, country, and source
                raw_type = address.get("type")
                mapped_type = map_value(raw_type, address_mapping)
                country = address.get("country", default_country)
                raw_source = address.get("source")
                mapped_source = map_value(raw_source, source_mapping)

                # Append cleaned and mapped address data
                addresses.append(
                    {
                        "businessId": business_id,
                        "type": mapped_type,
                        "street": address.get("street", ""),
                        "buildingNumber": address.get("buildingNumber", ""),
                        "entrance": address.get("entrance", ""),
                        "apartmentNumber": clean_numeric_column(
                            address.get("apartmentNumber")
                        ),
                        "apartmentIdSuffix": address.get("apartmentIdSuffix", ""),
                        "postOfficeBox": address.get("postOfficeBox", ""),
                        "postCode": clean_numeric_column(address.get("postCode")),
                        "co": address.get("co", ""),
                        "country": country,
                        "freeAddressLine": address.get("freeAddressLine", ""),
                        "registrationDate": address.get("registrationDate", ""),
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
        f"Processed {len(addresses)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(addresses)
