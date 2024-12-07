import logging

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.cleaning_utils import clean_numeric_column

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_addresses(data, lang):
    """
    Extracts and cleans address details from company data.

    Args:
        data (list): The company data to process.
        lang (str): Language abbreviation for mappings.

    Returns:
        list: Extracted and cleaned address rows.
    """
    rows = []

    try:
        # Dynamically load mappings
        address_mapping = mappings.get_mapping("address_mapping", lang)
        source_mapping = mappings.get_mapping("source_mapping", lang)
        default_country = mappings.get_mapping("default_country")

        if not address_mapping or not source_mapping:
            logger.error(f"Invalid language or missing mappings for: {lang}")
            return rows

        for company in data:
            business_id = company.get("businessId", {}).get("value", None)
            if not business_id:
                continue

            for address in company.get("addresses", []):
                # Map type, country, and source
                raw_type = address.get("type")
                mapped_type = (
                    address_mapping.get(str(raw_type))
                    or address_mapping.get(int(raw_type))
                    if raw_type is not None
                    else raw_type
                )
                country = address.get("country", "") or default_country
                raw_source = address.get("source")
                mapped_source = (
                    source_mapping.get(str(raw_source))
                    or source_mapping.get(int(raw_source))
                    if raw_source is not None
                    else raw_source
                )

                rows.append(
                    {
                        "businessId": business_id,
                        "type": mapped_type,
                        "street": address.get("street", ""),
                        "buildingNumber": address.get("buildingNumber", ""),
                        "entrance": address.get("entrance", ""),
                        "apartmentNumber": clean_numeric_column(
                            address.get("apartmentNumber", "")
                        ),
                        "apartmentIdSuffix": address.get("apartmentIdSuffix", ""),
                        "postOfficeBox": address.get("postOfficeBox", ""),
                        "postCode": clean_numeric_column(address.get("postCode", "")),
                        "co": address.get("co", ""),
                        "country": country,
                        "freeAddressLine": address.get("freeAddressLine", ""),
                        "registrationDate": address.get("registrationDate", ""),
                        "source": mapped_source,
                    }
                )

    except Exception as e:
        logger.error(f"Unexpected error during address extraction: {e}")

    return rows
