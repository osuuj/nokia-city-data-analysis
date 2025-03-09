import csv
import os


def clean_csv_file(filepath, output_filepath):
    """Clean a CSV file by removing extra quotes around the values and changing the delimiter from ';' to ','."""
    cleaned_rows = []
    with open(filepath, "r", newline="", encoding="utf-8") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar='"')
        for row in reader:
            cleaned_row = [col.strip().replace('"', "").replace("'", "") for col in row]
            cleaned_rows.append(cleaned_row)

    with open(output_filepath, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(
            csvfile, delimiter=",", quotechar='"', quoting=csv.QUOTE_MINIMAL
        )
        writer.writerows(cleaned_rows)


def clean_all_files_in_folder(folder_path):
    """Clean all CSV files in the specified folder and save them with 'cleaned' added to the filenames."""
    for filename in os.listdir(folder_path):
        if filename.endswith(".csv"):
            filepath = os.path.join(folder_path, filename)
            output_filepath = os.path.join(folder_path, f"cleaned_{filename}")
            print(f"Cleaning file: {filepath}")
            try:
                clean_csv_file(filepath, output_filepath)
                print(f"Saved cleaned file: {output_filepath}")
            except Exception as e:
                print(f"Failed to clean file {filepath}: {e}")


if __name__ == "__main__":
    folder_path = "etl/data/resources/Industry"
    clean_all_files_in_folder(folder_path)
