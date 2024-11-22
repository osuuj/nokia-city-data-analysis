import requests
import zipfile
import os
from config import URLS, FILE_PATHS, EXTRACTED_DIR

# Step 1: Download the files
def download_file(url, file_path):
    # Check if the file already exists and delete it
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Deleted old file at {file_path}")
    
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
    # Check if the directory already exists and delete its contents
    if os.path.exists(extracted_dir):
        for file in os.listdir(extracted_dir):
            file_path = os.path.join(extracted_dir, file)
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                os.rmdir(file_path)
        print(f"Cleared old extracted files in {extracted_dir}")
    
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extracted_dir)
    print(f"Extracted ZIP file to {extracted_dir}")

# Run the steps
for key, url in URLS.items():
    file_path = FILE_PATHS[key]
    download_file(url, file_path)
    if key == 'all_companies':
        extract_zip_file(file_path, EXTRACTED_DIR)