import os
import json
import ijson
from config import CITY, EXTRACTED_DIR, get_city_paths

def extract_data_by_city(item, city):
    """Check if any post office in the item's addresses is in the specified city."""
    return any(
        post_office.get('city', '') == city
        for address in item.get('addresses', [])
        for post_office in address.get('postOffices', [])
    )

def find_latest_json_file(directory):
    """Find the latest JSON file in the specified directory."""
    files = [f for f in os.listdir(directory) if f.endswith('.json')]
    files.sort(reverse=True)
    return files[0] if files else None

def main():
    # Get paths based on the city
    paths = get_city_paths(CITY)
    CITY_FILTERED_PATH = paths[0]

    # Create the city-specific folder if it doesn't exist
    city_folder = os.path.dirname(CITY_FILTERED_PATH)
    os.makedirs(city_folder, exist_ok=True)

    # Find the latest JSON file in the extracted directory
    latest_json_file = find_latest_json_file(EXTRACTED_DIR)
    if not latest_json_file:
        raise FileNotFoundError(f"No JSON file found in {EXTRACTED_DIR}")

    input_file_path = os.path.join(EXTRACTED_DIR, latest_json_file)

    # Define the output file path within the city-specific folder
    output_file_path = CITY_FILTERED_PATH

    # Read and filter items with address in the specified city
    with open(input_file_path, 'r') as file, open(output_file_path, 'w') as output_file:
        parser = ijson.items(file, 'item')
        filtered_items = [item for item in parser if extract_data_by_city(item, CITY)]
        json.dump(filtered_items, output_file, indent=4)

    print(f"Filtered data saved to {output_file_path}")

if __name__ == "__main__":
    main()