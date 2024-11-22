import requests
import zipfile
import os
import json

# Define the URL and file paths
url = 'https://avoindata.prh.fi/opendata-ytj-api/v3/all_companies'
zip_file_path = 'all_companies.zip'
extracted_dir = 'extracted_data'
json_file_path = os.path.join(extracted_dir, 'all_companies.json')

# Step 1: Download the ZIP file
def download_zip_file(url, zip_file_path):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(zip_file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=128):
                file.write(chunk)
        print(f"Downloaded ZIP file to {zip_file_path}")
    else:
        print(f"Failed to download file. Status code: {response.status_code}")

# Step 2: Extract the ZIP file
def extract_zip_file(zip_file_path, extracted_dir):
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extracted_dir)
    print(f"Extracted ZIP file to {extracted_dir}")

# Step 3: Process the JSON data
def process_json_data(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    print(f"Loaded JSON data from {json_file_path}")
    # Add your data processing logic here
    # For example, you can clean the data or insert it into a database

# Run the steps
download_zip_file(url, zip_file_path)
extract_zip_file(zip_file_path, extracted_dir)
process_json_data(json_file_path)