import logging
from etl.utils.extract_utils import get_business_id, validate_language
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG['mappings_path']
mappings = Mappings(mappings_file)

def extract_business_line_descriptions(data, lang):
    rows = []
    
    language_code_mapping = mappings.get_mapping("language_code_mapping", lang)

    if not validate_language(lang, language_code_mapping):
        return rows

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        descriptions = company.get('mainBusinessLine', {}).get('descriptions', [])
        for desc in descriptions:
            if str(desc.get('languageCode')) == language_code_mapping.get(lang):
                rows.append({
                    "businessId": business_id,
                    "languageCode": lang,
                    "description": desc.get('description', '')
                })

    return rows
