import logging
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG['mappings_path']
mappings = Mappings(mappings_file)

def extract_post_offices(data, lang):
    """
    Extracts post office details from JSON data, filtering by languageCode.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation ("fi", "sv", "en").

    Returns:
        list: Extracted post office rows filtered by the specified language.
    """
    rows = []
    post_office_language_code = mappings.get_mapping("post_office_language_code")

    # Get the numeric language code for the specified language
    lang_code = post_office_language_code.get(lang)
    if lang_code is None:
        logger.error(f"Invalid language code: {lang}")
        return rows

    # Process each company in the provided data
    for company in data:
        business_id = company.get('businessId', {}).get('value')
        if not business_id:
            logger.warning("Skipping company without businessId.")
            continue  # Skip if no businessId

        addresses = company.get('addresses', [])
        for address in addresses:
            for post_office in address.get('postOffices', []):
                # Check if the languageCode matches the target lang_code
                if str(post_office.get('languageCode')) == lang_code:
                    rows.append({
                        "businessId": business_id,
                        "postCode": post_office.get('postCode', ''),
                        "city": post_office.get('city', ''),
                        "active": post_office.get('active', ''),
                        "languageCode": lang,  # Store as the original language string
                        "municipalityCode": post_office.get('municipalityCode', '')
                    })

    return rows


