import unittest
import pandas as pd
from etl.pipeline.cleaning_data.process_business_info import process_business_info

class TestProcessData(unittest.TestCase):

    def test_process_business_info(self):
        json_part_data = [
            {
                "businessId": {"value": "123", "registrationDate": "2020-01-01"},
                "status": "active",
                "website": {"url": "http://example.com", "registrationDate": "2020-01-01"},
                "lastModified": "2020-01-01"
            }
        ]
        df = process_business_info(json_part_data)
        self.assertIsInstance(df, pd.DataFrame)
        self.assertEqual(df.iloc[0]['business_id'], "123")

if __name__ == '__main__':
    unittest.main()
