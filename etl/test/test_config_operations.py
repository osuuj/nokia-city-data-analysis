import unittest
from etl.utils.config_operations import load_yaml, load_config, get_city_paths

class TestConfigOperations(unittest.TestCase):

    def test_load_yaml(self):
        data = load_yaml('etl/config/cities.yml')
        self.assertIn('cities', data)

    def test_load_config(self):
        cities = load_config('etl/config/cities.yml', 'cities')
        self.assertIsInstance(cities, list)

    def test_get_city_paths(self):
        city_paths = get_city_paths('NOKIA', 'etl/data/3_processed')
        self.assertIn('city_dir', city_paths)
        self.assertIn('filtered_dir', city_paths)

if __name__ == '__main__':
    unittest.main()
