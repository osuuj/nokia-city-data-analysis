import logging

logger = logging.getLogger(__name__)

def extract_addresses(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        for address in company.get('addresses', []):
            rows.append({
                "businessId": business_id,
                "type": address.get('type', ''),
                "street": address.get('street', ''),
                "postCode": address.get('postCode', ''),
                "postOfficeBox": address.get('postOfficeBox', ''),
                "buildingNumber": address.get('buildingNumber', ''),
                "entrance": address.get('entrance', ''),
                "apartmentNumber": address.get('apartmentNumber', ''),
                "apartmentIdSuffix": address.get('apartmentIdSuffix', ''),
                "co": address.get('co', ''),
                "country": address.get('country', ''),
                "freeAddressLine": address.get('freeAddressLine', ''),
                "registrationDate": address.get('registrationDate', ''),
                "source": address.get('source', '')
            })
    return rows

