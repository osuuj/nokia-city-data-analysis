import pytest
import pandas as pd
import yaml

@pytest.fixture
def sample_mappings():
    """Fixture to load sample mappings."""
    return {
        "mappings": {
            "authority": {
                "fi": {"1": "Verohallinto", "2": "Patentti- ja rekisterihallitus"},
                "en": {"1": "Tax Administration", "2": "Finnish Patent Office"}
            }
        }
    }

@pytest.fixture
def sample_dataframe():
    """Fixture to provide a sample DataFrame."""
    data = {"column1": ["1", "2", "3"], "column2": ["a", "b", "c"]}
    return pd.DataFrame(data)
