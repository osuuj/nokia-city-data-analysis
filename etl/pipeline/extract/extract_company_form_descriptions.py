import logging

logger = logging.getLogger(__name__)

def extract_company_form_descriptions(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        for form in company.get('companyForms', []):
            descriptions = form.get('descriptions', [])
            for desc in descriptions:
                rows.append({
                    "businessId": business_id,
                    "type": form.get('type', ''),
                    "languageCode": desc.get('languageCode', ''),
                    "description": desc.get('description', '')
                })
    return rows
