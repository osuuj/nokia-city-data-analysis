import logging
from etl.utils.extract_utils import get_business_id, filter_by_language_code
from etl.config.mappings.mappings import post_office_language_code

logger = logging.getLogger(__name__)

def extract_post_offices(data, lang):
    """
    Extracts post office details filtered by language code.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for filtering (e.g., "fi", "en", "sv").

    Returns:
        list: Extracted rows with post office details.
    """
    rows = []

    if not validate_language(lang, post_office_language_code):
        return rows

    lang_code = post_office_language_code[lang]

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for address in company.get('addresses', []):
            for post_office in address.get('postOffices', []):
                if str(post_office.get('languageCode')) == lang_code:
                    rows.append({
                        "businessId": business_id,
                        "postCode": post_office.get('postCode', ''),
                        "city": post_office.get('city', ''),
                        "active": post_office.get('active', ''),
                        "languageCode": lang,
                        "municipalityCode": post_office.get('municipalityCode', '')
                    })

    return rows
