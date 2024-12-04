from etl.utils.cleaning_utils import handle_missing_values, enforce_column_types
import pandas as pd

def test_handle_missing_values():
    data = {"column1": ["value1", None, ""], "date_column": ["2022-01-01", "", None]}
    df = pd.DataFrame(data)
    df = handle_missing_values(df)

    assert df["column1"].isnull().sum() == 1
    assert pd.isnull(df["date_column"].iloc[1])

def test_enforce_column_types():
    data = {"string_col": [1, 2, 3], "date_col": ["2022-01-01", "invalid-date", None]}
    df = pd.DataFrame(data)
    column_types = {"string_col": "string", "date_col": "date"}

    df = enforce_column_types(df, column_types)

    assert df["string_col"].dtype == "object"
    assert pd.to_datetime(df["date_col"], errors="coerce").isnull().sum() == 1
