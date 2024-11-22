import ijson
import json
import os
from config import EXTRACTED_DIR, CITY_FILTERED_PATH

# Define the city to filter by
CITY = 'NOKIA'

# Function to check if the address is in Nokia
def extract_data_by_city(item):
    return any(
        post_office.get('city', '') == CITY
        for address in item.get('addresses', [])
        for post_office in address.get('postOffices', [])
    )

# Create the city-specific folder if it doesn't exist
city_folder = os.path.join(os.path.dirname(CITY_FILTERED_PATH), CITY)
os.makedirs(city_folder, exist_ok=True)

# Define the input file path within the extracted directory
input_file_path = os.path.join(EXTRACTED_DIR, 'all_companies.json')

# Define the output file path within the city-specific folder
output_file_path = os.path.join(city_folder, os.path.basename(CITY_FILTERED_PATH))

# Read and filter items with address in Nokia
with open(input_file_path, 'r') as file, open(output_file_path, 'w') as output_file:
    parser = ijson.items(file, 'item')
    filtered_items = [item for item in parser if extract_data_by_city(item)]
    json.dump(filtered_items, output_file, indent=4)

print(f"Filtered data saved to {output_file_path}")