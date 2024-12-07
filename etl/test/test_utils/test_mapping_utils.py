from etl.utils.mapping_utils import apply_column_mapping


def test_apply_column_mapping(sample_dataframe, sample_mappings):
    df = sample_dataframe
    df = apply_column_mapping(df, "column1", sample_mappings, "authority", "fi")
    assert df["column1"].tolist() == [
        "Verohallinto",
        "Patentti- ja rekisterihallitus",
        "3",
    ]
