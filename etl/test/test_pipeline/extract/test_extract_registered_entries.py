from etl.pipeline.extract.extract_registered_entries import extract_registered_entries


def test_extract_registered_entries():
    sample_data = [
        {
            "businessId": {"value": "12345"},
            "registeredEntries": [
                {
                    "type": "1",
                    "register": "1",
                    "authority": "1",
                    "registrationDate": "2022-01-01",
                }
            ],
        }
    ]
    lang = "fi"
    rows = extract_registered_entries(sample_data, lang)

    assert len(rows) == 1
    assert rows[0]["businessId"] == "12345"
    assert rows[0]["register"] == "Verohallinto"
