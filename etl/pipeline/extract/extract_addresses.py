import logging
from etl.utils.extract_utils import get_business_id, validate_language, map_value, clean_address_data
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG['mappings_path']
mappings = Mappings(mappings_file)

def extract_addresses(data, lang):
    rows = []
    
    address_mapping = mappings.get_mapping("address_mapping", lang)
    source_mapping = mappings.get_mapping("source_mapping", lang)
    default_country= mappings.get_mapping("default_country")

    if not validate_language(lang, address_mapping) or not validate_language(lang, source_mapping):
        return rows

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for address in company.get('addresses', []):
            mapped_type = map_value(address.get('type', ''), address_mapping)
            mapped_source = map_value(address.get('source', ''), source_mapping)

            row = {
                "businessId": business_id,
                "type": mapped_type,
                "street": address.get('street', ''),
                "postCode": address.get('postCode', ''),
                "postOfficeBox": address.get('postOfficeBox', ''),
                "buildingNumber": address.get('buildingNumber', ''),
                "entrance": address.get('entrance', ''),
                "apartmentNumber": address.get('apartmentNumber', ''),
                "apartmentIdSuffix": address.get('apartmentIdSuffix', ''),
                "co": address.get('co', ''),
                "freeAddressLine": address.get('freeAddressLine', ''),
                "registrationDate": address.get('registrationDate', ''),
                "country": address.get('country', '') or default_country,
                "source": mapped_source,
            }
            rows.append(clean_address_data(row))

    return rows
