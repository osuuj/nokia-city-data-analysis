import pytest

from etl.config.mappings.mappings import Mappings


def test_load_mappings():
    mappings = Mappings("tests/fixtures/sample_mappings.yml")
    assert mappings.get_mapping("authority", "fi") == {
        "1": "Verohallinto",
        "2": "Patentti- ja rekisterihallitus",
    }
    assert mappings.get_mapping("authority", "en") == {
        "1": "Tax Administration",
        "2": "Finnish Patent Office",
    }


def test_invalid_mapping():
    mappings = Mappings("tests/fixtures/sample_mappings.yml")
    with pytest.raises(KeyError):
        mappings.validate_mapping("nonexistent", "fi")
