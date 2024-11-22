import csv
import json
import os
from config import SPLIT_DIR, CLEANED_DIR, CITY

# Function to extract English descriptions only
def filter_english_descriptions(descriptions):
    return [desc['description'] for desc in descriptions if desc['languageCode'] == "3"]

# Ensure output directory exists
os.makedirs(CLEANED_DIR, exist_ok=True)