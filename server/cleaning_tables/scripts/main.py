"""This script orchestrates the initial cleaning process for the addresses.csv file. It reads the raw dataset, applies basic cleaning operations, and saves the cleaned output as an intermediate file. This script adheres to clean coding practices and is compatible with tools like ruff, black, darglint, pyright, and isort.

Functions:
    main: Executes the workflow from reading raw data to saving the cleaned dataset.
"""

from pathlib import Path

from server.cleaning_tables.scripts.adding_lat_lang import find_coordinates_values
from server.cleaning_tables.scripts.file_processing import process_csv


def main():
    """Main entry point for processing addresses.csv."""
    input_dir = Path("server/cleaning_tables/data/raw")
    intermediate_output_dir = Path("server/cleaning_tables/data/intermediate")
    cleaned_addresses_path = Path(
        "server/cleaning_tables/data/intermediate/cleaned_addresses.csv"
    )
    resource_files_pattern = (
        "server/cleaning_tables/data/resources/*_addresses_2024-11-14.csv"
    )
    output_dir = Path("server/cleaning_tables/data/processed")
    output_dir.mkdir(parents=True, exist_ok=True)

    file_path = input_dir / "addresses.csv"
    if file_path.exists():
        process_csv(file_path, intermediate_output_dir)
        find_coordinates_values(
            cleaned_addresses_path, resource_files_pattern, output_dir
        )
    else:
        print(f"File not found: {file_path}")


if __name__ == "__main__":
    main()
