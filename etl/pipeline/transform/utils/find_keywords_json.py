"""This script searches for keywords in JSON and CSV files and saves the results to new files.

Functions:
    find_keywords_in_json: Search for keywords in JSON files and save the results.
    find_keywords_in_csv: Search for keywords in CSV files and save the results.
    main: Main function to execute the script.
"""

import glob
import json
import os
from pathlib import Path

import pandas as pd


def find_keywords_in_json(input_dir, output_dir, keywords):
    """Search for keywords in JSON files and save the results.

    Args:
        input_dir (str): Directory containing JSON files.
        output_dir (str): Directory to save the results.
        keywords (list): List of keywords to search for.
    """
    json_files = glob.glob(os.path.join(input_dir, "*.json"))
    for json_file in json_files:
        with open(json_file, "r") as f:
            data = json.load(f)

        results = []
        for item in data:
            business_id = item.get("businessId", {}).get("value", "")
            if any(keyword in business_id for keyword in keywords):
                results.append(item)

        if results:
            output_file = os.path.join(output_dir, os.path.basename(json_file))
            with open(output_file, "w") as f:
                json.dump(results, f, indent=4)


def find_keywords_in_csv(input_dir, output_dir, keywords):
    """Search for keywords in CSV files and save the results.

    Args:
        input_dir (str): Directory containing CSV files.
        output_dir (str): Directory to save the results.
        keywords (list): List of keywords to search for.
    """
    csv_files = glob.glob(os.path.join(input_dir, "*.csv"))
    for csv_file in csv_files:
        df = pd.read_csv(csv_file)
        print(f"Processing file: {csv_file}")
        print(f"Columns in the file: {df.columns.tolist()}")

        # Check for both possible column names
        if "businessId" in df.columns:
            column_name = "businessId"
        elif "business_id" in df.columns:
            column_name = "business_id"
        else:
            print(
                f"Warning: 'businessId' or 'business_id' column not found in {csv_file}"
            )
            continue
        results = df[df[column_name].astype(str).str.contains("|".join(keywords))]

        if not results.empty:
            if "cleaned" in csv_file:
                output_file = os.path.join(
                    output_dir, "cleaned_" + os.path.basename(csv_file)
                )
            elif "extracted" in csv_file:
                output_file = os.path.join(
                    output_dir, "extracted_" + os.path.basename(csv_file)
                )
            else:
                output_file = os.path.join(output_dir, os.path.basename(csv_file))
            results.to_csv(output_file, index=False)


def main():
    """Main function to execute the script."""
    keywords = ["0656981-2"]  # Add your keywords here

    # Directories
    json_input_dir = "etl/data/3_processed/chunks"
    csv_cleaned_input_dir = "etl/data/3_processed/cleaned/addresses"
    csv_extracted_input_dir = "etl/data/3_processed/extracted/addresses"
    json_output_dir = "server/cleaning_tables/data/test"
    csv_cleaned_output_dir = "server/cleaning_tables/data/test"
    csv_extracted_output_dir = "server/cleaning_tables/data/test"

    # Create output directories if they don't exist
    Path(json_output_dir).mkdir(parents=True, exist_ok=True)
    Path(csv_cleaned_output_dir).mkdir(parents=True, exist_ok=True)
    Path(csv_extracted_output_dir).mkdir(parents=True, exist_ok=True)

    # Find keywords in JSON files
    find_keywords_in_json(json_input_dir, json_output_dir, keywords)

    # Find keywords in cleaned CSV files
    find_keywords_in_csv(csv_cleaned_input_dir, csv_cleaned_output_dir, keywords)

    # Find keywords in extracted CSV files
    find_keywords_in_csv(csv_extracted_input_dir, csv_extracted_output_dir, keywords)


if __name__ == "__main__":
    main()
