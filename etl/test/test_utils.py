import unittest
from etl.utils.helpers import format_date

class TestUtils(unittest.TestCase):

    def test_format_date(self):
        self.assertEqual(format_date("2020-01-01"), "2020-01-01")
        self.assertIsNone(format_date("invalid-date"))

if __name__ == '__main__':
    unittest.main()
