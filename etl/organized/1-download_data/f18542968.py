import requests
import zipfile
import os

# Define the URLs and file paths
urls = {
    'all_companies': 'https://avoindata.prh.fi/opendata-ytj-api/v3/all_companies',
    'post_codes_en': 'https://avoindata.prh.fi/opendata-ytj-api/v3/post_codes?lang=en',
    'post_codes_fi': 'https://avoindata.prh.fi/opendata-ytj-api/v3/post_codes?lang=fi',
    'description_en': 'https://avoindata.prh.fi/opendata-ytj-api/v3/description?code=TOIMI3&lang=en',
    'description_fi': 'https://avoindata.prh.fi/opendata-ytj-api/v3/description?code=TOIMI3&lang=fi'
}

file_paths = {
    'all_companies': 'data/raw/all_companies.zip',
    'post_codes_en': 'data/raw/post_codes_en.json',
    'post_codes_fi': 'data/raw/post_codes_fi.json',
    'description_en': 'data/raw/description_en.json',
    'description_fi': 'data/raw/description_fi.json'
}

extracted_dir = 'data/raw/extracted_data'

# Step 1: Download the files
def download_file(url, file_path):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=128):
                file.write(chunk)
        print(f"Downloaded file to {file_path}")
    else:
        print(f"Failed to download file from {url}. Status code: {response.status_code}")

# Step 2: Extract the ZIP file (if applicable)
def extract_zip_file(zip_file_path, extracted_dir):
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extracted_dir)
    print(f"Extracted ZIP file to {extracted_dir}")

# Run the steps
for key, url in urls.items():
    file_path = file_paths[key]
    download_file(url, file_path)
    if key == 'all_companies':
        extract_zip_file(file_path, extracted_dir)