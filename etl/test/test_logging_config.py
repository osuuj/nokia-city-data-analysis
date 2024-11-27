import os
import logging
import unittest
from logging_config import configure_logging

class TestLoggingConfig(unittest.TestCase):

    def setUp(self):
        configure_logging()
        self.logger = logging.getLogger(__name__)

    def test_log_file_creation(self):
        log_dir = os.getenv('LOG_DIR', 'logs')
        log_file_path = os.path.join(log_dir, 'etl.log')
        self.assertTrue(os.path.exists(log_file_path), "Log file was not created")

    def test_log_level(self):
        log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
        self.assertEqual(self.logger.level, getattr(logging, log_level), "Log level is not set correctly")

    def test_logging_output(self):
        with self.assertLogs(self.logger, level='INFO') as log:
            self.logger.info("Test log message")
            self.assertIn("Test log message", log.output[0])

if __name__ == '__main__':
    unittest.main()
