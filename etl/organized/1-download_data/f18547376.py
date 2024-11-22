import ijson
import json
from config import EXTRACTED_DIR, CITY_FILTERED_PATH

# Define the city to filter by
CITY = 'NOKIA'

# Function to check if the address is in Nokia
def extract_data_by_city(item):
    return any(
        post_office.get('city', '') == 'NOKIA'
        for address in item.get('addresses', [])
        for post_office in address.get('postOffices', [])
    )

# Read and filter items with address in Nokia
with open(EXTRACTED_DIR, 'r') as file, open(CITY_FILTERED_PATH, 'w') as output_file:
    parser = ijson.items(file, 'item')
    filtered_items = (item for item in parser if extract_data_by_city(item))
    json.dump(list(filtered_items), output_file, indent=4)