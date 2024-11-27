import unittest
import os
from etl.utils.directory_operations import ensure_directory_exists, clear_directory

class TestDirectoryOperations(unittest.TestCase):

    def test_ensure_directory_exists(self):
        test_dir = 'tests/test_dir'
        ensure_directory_exists(test_dir)
        self.assertTrue(os.path.exists(test_dir))
        os.rmdir(test_dir)

    def test_clear_directory(self):
        test_dir = 'tests/test_dir'
        os.makedirs(test_dir, exist_ok=True)
        with open(os.path.join(test_dir, 'test_file.txt'), 'w') as f:
            f.write('test')
        clear_directory(test_dir)
        self.assertFalse(os.listdir(test_dir))
        os.rmdir(test_dir)

if __name__ == '__main__':
    unittest.main()
