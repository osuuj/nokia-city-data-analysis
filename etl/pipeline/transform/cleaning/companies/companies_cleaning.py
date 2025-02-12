from urllib.parse import urlparse

import pandas as pd

from etl.utils.file_io import save_to_csv


def clean_website(url: str) -> str:
    """Standardizes website URLs by ensuring they have a valid format.

    Args:
        url (str): The website URL to clean.

    Returns:
        str: The standardized website URL or an empty string if invalid.
    """
    if pd.isna(url) or url.strip().lower() in ["unknown", "n/a", "none", "null", ""]:
        return ""  # Treat missing or unknown values as empty

    url = url.strip().lower()  # Normalize case and trim spaces

    # If the URL does not start with http or https, add "http://"
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    # Parse the URL and reconstruct a valid format
    parsed_url = urlparse(url)
    if not parsed_url.netloc:
        return ""  # Invalid URL

    # Ensure "www." is present where needed
    if not parsed_url.netloc.startswith("www.") and "." in parsed_url.netloc:
        url = f"{parsed_url.scheme}://www.{parsed_url.netloc}{parsed_url.path}"
    return url


def clean_companies(df: pd.DataFrame, staging_dir: str, output_dir: str) -> None:

    # Apply website cleaning function
    df["website"] = df["website"].apply(clean_website)

    # Convert `registrationDate` and `lastModified` to YYYY-MM-DD format
    df["registration_date"] = pd.to_datetime(
        df["registration_date"], errors="coerce"
    ).dt.strftime("%Y-%m-%d")
    df["last_modified"] = pd.to_datetime(
        df["last_modified"], errors="coerce"
    ).dt.strftime("%Y-%m-%d")

    # Convert `endDate` to YYYY-MM-DD (NULL if missing)
    df["end_date"] = pd.to_datetime(df["end_date"], errors="coerce").dt.strftime(
        "%Y-%m-%d"
    )

    # Filter rows where the `website` column is missing
    df_missing_website = df[df["website"].isna() | (df["website"].str.strip() == "")]
    # Remove the filtered rows from the original DataFrame
    df = df[~df.index.isin(df_missing_website.index)]
    # Save the cleaned DataFrame to a file
    save_to_csv(df, f"{output_dir}/cleaned_companies_website.csv")
    # Save the filtered rows to another file
    save_to_csv(
        df_missing_website, f"{output_dir}/cleaned_companies_missing_website.csv"
    )

    print("Cleaning process completed. Cleaned file saved as 'cleaned_companies.csv'.")
