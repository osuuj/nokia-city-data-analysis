def clean_and_filter_rows(df):
    """Clean and filter rows based on specific criteria.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The cleaned and filtered DataFrame.
    """
    # Normalize relevant columns to lowercase and strip whitespace
    for col in ["co", "free_address_line"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.lower()

    # Remove rows where the registration_date column is None or NaN
    df = df.dropna(subset=["registration_date"])

    # Remove rows where both 'co' and 'free_address_line' are empty or NaN
    condition = (df["co"].fillna("").str.strip() == "") & (
        df["free_address_line"].fillna("").str.strip() == ""
    )
    df = df[~condition]

    return df
