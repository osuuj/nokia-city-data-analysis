import ijson
import json
import os
from config import EXTRACTED_DIR, CITY, get_city_paths

# Function to check if the address is in the specified city
def extract_data_by_city(item, city):
    return any(
        post_office.get('city', '') == city
        for address in item.get('addresses', [])
        for post_office in address.get('postOffices', [])
    )

# Find the latest JSON file in the extracted directory
def find_latest_json_file(directory):
    if not os.path.exists(directory):
        raise FileNotFoundError(f"Directory {directory} does not exist")
    files = [f for f in os.listdir(directory) if f.endswith('.json')]
    files.sort(reverse=True)
    return files[0] if files else None

# Read and filter items with address in the specified city
def filter_city_data(input_file, output_file, city):
    with open(input_file, 'r') as file, open(output_file, 'w') as output_file:
        parser = ijson.items(file, 'item')
        filtered_items = [item for item in parser if extract_data_by_city(item, city)]
        json.dump(filtered_items, output_file, indent=4)
    print(f"Filtered data saved to {output_file}")

def main():
    # Get paths based on the city
    city_filtered_path, split_dir, cleaned_dir, ready_for_db_dir = get_city_paths(CITY)

    # Create the city-specific folder if it doesn't exist
    city_folder = os.path.dirname(city_filtered_path)
    os.makedirs(city_folder, exist_ok=True)

    # Define the input file path within the extracted directory
    latest_json_file = find_latest_json_file(EXTRACTED_DIR)
    if not latest_json_file:
        raise FileNotFoundError(f"No JSON file found in {EXTRACTED_DIR}")

    input_file_path = os.path.join(EXTRACTED_DIR, latest_json_file)

    # Define the output file path within the city-specific folder
    output_file_path = city_filtered_path

    # Run the filtering process
    filter_city_data(input_file_path, output_file_path, CITY)

if __name__ == "__main__":
    main()