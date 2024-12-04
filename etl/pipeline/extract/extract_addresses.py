import logging
from etl.config.mappings import address_mapping, source_mapping, default_country

logger = logging.getLogger(__name__)

def clean_addresses_data(rows):
    """
    Clean and standardize the address data rows.
    """
    for row in rows:
        # Clean apartmentNumber (e.g., replace commas with periods)
        if "apartmentNumber" in row:
            row["apartmentNumber"] = (
                str(row["apartmentNumber"]).replace(",", ".") if row["apartmentNumber"] else None
            )

        # Convert postCode to string and remove decimals
        if "postCode" in row:
            row["postCode"] = (
                str(row["postCode"]).split(".")[0] if row["postCode"] else None
            )
    return rows

def extract_addresses(data, lang):
    """
    Extracts and cleans address details from company data.
    """
    rows = []

    # Existing logic for mapping
    address_lang = address_mapping.get(lang)
    source_lang = source_mapping.get(lang)

    if not address_lang or not source_lang:
        logger.error(f"Invalid language code or missing mappings: {lang}")
        return rows

    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue

        for address in company.get('addresses', []):
            # Map type, country, and source
            raw_type = address.get('type')
            mapped_type = (
                address_lang.get(str(raw_type)) or address_lang.get(int(raw_type))
                if raw_type is not None else raw_type
            )
            country = address.get('country', '') or default_country
            raw_source = address.get('source')
            mapped_source = (
                source_lang.get(str(raw_source)) or source_lang.get(int(raw_source))
                if raw_source is not None else raw_source
            )

            rows.append({
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
                "country": country,
                "freeAddressLine": address.get('freeAddressLine', ''),
                "registrationDate": address.get('registrationDate', ''),
                "source": mapped_source
            })

    # Clean address rows before returning
    rows = clean_addresses_data(rows)
    return rows
