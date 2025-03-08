"""This module provides functionality to process the main business lines dataset."""

import pandas as pd
from rapidfuzz import fuzz, process


def find_best_match(description, choices):
    """Find the best match for a description from a list of choices using rapidfuzz.

    Args:
        description (str): The description to match.
        choices (list): A list of choices to match against.

    Returns:
        str: The best match from the choices.
    """
    best_match = process.extractOne(description, choices, scorer=fuzz.token_sort_ratio)
    return best_match[0] if best_match else None


def map_industry_code_to_category(
    industry_code, description, lang_column, source_to_target_dict, industry_2025_dict
):
    """Map industry code to category and title.

    Args:
        industry_code (str): The industry code to map.
        description (str): The industry description.
        lang_column (str): The language column to use for the title.
        source_to_target_dict (dict): Dictionary for quick lookup of target codes.
        industry_2025_dict (dict): Dictionary for quick lookup of categories and titles.

    Returns:
        tuple: The title and category.
    """
    if industry_code in source_to_target_dict:
        target_code = source_to_target_dict[industry_code]
    else:
        best_match = find_best_match(industry_code, list(source_to_target_dict.keys()))
        target_code = source_to_target_dict.get(best_match, None)

    if target_code:
        category_row = industry_2025_dict.get(target_code, None)
        if category_row:
            category = category_row["Category"]
            title = category_row[lang_column]
            return title, category
    return None, None


def process_main_business_lines(main_business_lines_df: pd.DataFrame) -> pd.DataFrame:
    """Process the main_business_lines DataFrame to fill missing industry_letter values.

    This function processes the main_business_lines DataFrame to fill missing
    industry letters by mapping industry codes to categories and titles using
    additional datasets.

    Args:
        main_business_lines_df (pd.DataFrame): DataFrame containing the main business lines data.

    Returns:
        pd.DataFrame: Processed DataFrame with filled industry_letter values.
    """
    # Load the additional datasets
    toimiala_2008_to_2025_df = pd.read_csv(
        "etl/data/resources/Industry/cleaned_toimiala_2008_to_2025_en.csv"
    )
    industry_2025_df = pd.read_csv("etl/config/mappings/industry_2025.csv")

    # Rename columns for consistency
    main_business_lines_df.rename(
        columns={
            "industryLetter": "industry_letter",
            "industryCode": "industry_code",
            "industryDescription": "industry_description",
        },
        inplace=True,
    )

    # Ensure the data types match
    main_business_lines_df["industry_code"] = main_business_lines_df[
        "industry_code"
    ].astype(str)
    toimiala_2008_to_2025_df["sourceCode"] = toimiala_2008_to_2025_df[
        "sourceCode"
    ].astype(str)

    # Filter rows where industry letter is missing
    missing_industry_letter_df = main_business_lines_df[
        main_business_lines_df["industry_letter"].isna()
    ].copy()

    # Remove those filtered rows from main_business_lines_df
    main_business_lines_df = main_business_lines_df[
        ~main_business_lines_df["industry_letter"].isna()
    ]

    # Create a dictionary for quick lookup of target codes
    source_to_target_dict = toimiala_2008_to_2025_df.set_index("sourceCode")[
        "targetCode"
    ].to_dict()

    # Handle duplicates in industry_2025_df by grouping and selecting the first occurrence
    industry_2025_df = industry_2025_df.groupby("TOL 2025").first().reset_index()

    # Create a dictionary for quick lookup of categories and titles
    industry_2025_dict = industry_2025_df.set_index("TOL 2025").to_dict(orient="index")

    # Define the language column to use
    lang_column = "Title_en"  # Change this to "Title_fi" or "Title_sv" as needed

    # Apply the mapping function to the DataFrame
    missing_industry_letter_df[["industry", "industry_letter"]] = (
        missing_industry_letter_df.apply(
            lambda row: pd.Series(
                map_industry_code_to_category(
                    row["industry_code"],
                    row["industry_description"],
                    lang_column,
                    source_to_target_dict,
                    industry_2025_dict,
                )
            ),
            axis=1,
        )
    )

    # Merge the updated missing_industry_letter_df back into main_business_lines_df
    main_business_lines_df = pd.concat(
        [main_business_lines_df, missing_industry_letter_df]
    )

    return main_business_lines_df
