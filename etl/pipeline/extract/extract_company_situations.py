import logging

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_company_situations(data, lang):
    """
    Extracts company situations from JSON data for a specific language.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        list: Extracted company situation rows.
    """
    rows = []

    try:
        # Retrieve type and source mappings for the specified language
        type_mapping = mappings.get_mapping("type_mapping", lang)
        source_mapping = mappings.get_mapping("source_mapping", lang)

        if not type_mapping or not source_mapping:
            logger.error(f"Invalid language code: {lang}")
            return rows

        for company in data:
            business_id = get_business_id(company)
            if not business_id:
                logger.warning("Skipping company without businessId.")
                continue

            for situation in company.get("companySituations", []):
                # Map type
                raw_type = situation.get("type", "")
                mapped_type = type_mapping.get(raw_type, raw_type)

                # Map source
                raw_source = situation.get("source", None)
                mapped_source = source_mapping.get(raw_source, raw_source)

                rows.append(
                    {
                        "businessId": business_id,
                        "type": mapped_type,
                        "registrationDate": situation.get("registrationDate", ""),
                        "endDate": situation.get("endDate", None),
                        "source": mapped_source,
                    }
                )

        logger.info(f"Extracted {len(rows)} company situations for language: {lang}")

    except KeyError as e:
        logger.error(f"KeyError in extract_company_situations: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_company_situations: {e}")

    return rows
