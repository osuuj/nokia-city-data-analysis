import logging
from etl.utils.extract_utils import get_business_id, validate_language, map_value
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG['mappings_path']
mappings = Mappings(mappings_file)

def extract_company_forms(data, lang):
    """
    Extracts company forms with source mapping.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings (e.g., "fi", "en", "sv").

    Returns:
        list: Extracted rows with company forms.
    """
    rows = []

    source_mapping = mappings.get_mapping("source_mapping", lang)
    

    if not validate_language(lang, source_mapping):
        return rows

    source_lang = source_mapping[lang]

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for form in company.get('companyForms', []):
            rows.append({
                "businessId": business_id,
                "type": form.get('type', ''),
                "registrationDate": form.get('registrationDate', ''),
                "endDate": form.get('endDate', None),
                "version": form.get('version', 0),
                "source": map_value(form.get('source', None), source_lang)
            })
    return rows

