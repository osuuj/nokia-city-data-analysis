import logging

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id, map_value

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_names(data, lang):
    """
    Extracts names of companies and maps their types.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings (e.g., "fi", "en", "sv").

    Returns:
        list: Extracted rows with company names and types.
    """

    name_type_mapping = mappings.get_mapping("name_type_mapping", lang)
    source_mapping = mappings.get_mapping("source_mapping", lang)

    rows = []

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for name in company.get("names", []):
            mapped_type = map_value(name.get("type", ""), name_type_mapping)
            mapped_source = map_value(name.get("source", ""), source_mapping)

            rows.append(
                {
                    "businessId": business_id,
                    "name": name.get("name", ""),
                    "type": mapped_type,
                    "registrationDate": name.get("registrationDate", ""),
                    "endDate": name.get("endDate", None),
                    "version": name.get("version", 0),  # Fixed `name_entry` reference
                    "source": mapped_source,  # Correctly maps the `source` field
                }
            )
    return rows
