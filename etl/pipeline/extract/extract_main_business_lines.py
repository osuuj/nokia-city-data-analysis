import logging
from etl.utils.extract_utils import get_business_id, validate_language
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG['mappings_path']
mappings = Mappings(mappings_file)

def extract_main_business_lines(data, lang):
    """
    Extracts main business lines filtered by language.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation (e.g., "fi", "en", "sv").

    Returns:
        list: Extracted rows with main business lines.
    """
    rows = []

    language_code_mapping = mappings.get_mapping("language_code_mapping")

    if not validate_language(lang, language_code_mapping):
        return rows

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for business_line in company.get('mainBusinessLines', []):
            if business_line.get('languageCode') == language_code_mapping[lang]:
                rows.append({
                    "businessId": business_id,
                    "description": business_line.get('description', '')
                })
    return rows
