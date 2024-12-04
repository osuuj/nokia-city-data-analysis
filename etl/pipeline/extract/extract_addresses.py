import logging
from etl.utils.extract_utils import get_business_id, validate_language, map_value, clean_address_data
from etl.config.mappings.mappings import address_mapping, source_mapping, default_country

logger = logging.getLogger(__name__)

def extract_addresses(data, lang):
    rows = []

    if not validate_language(lang, address_mapping) or not validate_language(lang, source_mapping):
        return rows

    address_lang = address_mapping[lang]
    source_lang = source_mapping[lang]

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for address in company.get('addresses', []):
            mapped_type = map_value(address.get('type', ''), address_lang)
            mapped_source = map_value(address.get('source', ''), source_lang)

            row = {
                "businessId": business_id,
                "type": mapped_type,
                "street": address.get('street', ''),
                "postCode": address.get('postCode', ''),
                "country": address.get('country', '') or default_country,
                "source": mapped_source,
            }
            rows.append(clean_address_data(row))

    return rows
