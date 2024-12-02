import logging

logger = logging.getLogger(__name__)

def extract_post_offices(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        for address in company.get('addresses', []):
            for post_office in address.get('postOffices', []):
                rows.append({
                    "businessId": business_id,
                    "postCode": post_office.get('postCode', ''),
                    "city": post_office.get('city', ''),
                    "active": post_office.get('active', ''),
                    "languageCode": post_office.get('languageCode', ''),
                    "municipalityCode": post_office.get('municipalityCode', '')
                })
    return rows
