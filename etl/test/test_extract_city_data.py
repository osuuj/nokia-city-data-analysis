import unittest
from etl.pipeline.extract_data.extract_city_data import extract_data_by_city

class TestExtractCityData(unittest.TestCase):

    def test_extract_data_by_city(self):
        item = {
            "addresses": [
                {
                    "postOffices": [
                        {"city": "NOKIA"}
                    ]
                }
            ]
        }
        self.assertTrue(extract_data_by_city(item, "NOKIA"))
        self.assertFalse(extract_data_by_city(item, "TAMPERE"))

if __name__ == '__main__':
    unittest.main()
