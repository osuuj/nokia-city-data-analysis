import pandas as pd

from etl.pipeline.transform.cleaning import clean_dataset


def test_clean_dataset(tmp_path, sample_dataframe):
    input_file = tmp_path / "input.csv"
    output_file = tmp_path / "output.csv"
    sample_dataframe.to_csv(input_file, index=False)

    column_types = {"column1": "string", "column2": "string"}
    lang = "fi"

    clean_dataset(input_file, output_file, column_types, lang)

    df = pd.read_csv(output_file)
    assert "column1" in df.columns
    assert df.shape == (3, 2)
