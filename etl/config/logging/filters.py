"""Custom logging filters.

This module provides filters to manage log output, including filtering
specific log messages and sanitizing sensitive information.
"""

import logging
import re


class ChunkProcessingFilter(logging.Filter):
    """Filter to exclude specific chunk processing log messages."""

    def filter(self, record: logging.LogRecord) -> bool:
        """Determine if a log record should be included.

        Args:
            record (logging.LogRecord): The log record to check.

        Returns:
            bool: True if the log record should be included, False otherwise.
        """
        return not record.getMessage().startswith(
            "Processing etl/data/3_processed/chunks/chunk_"
        )


class SensitiveDataFilter(logging.Filter):
    """Filter to sanitize sensitive data from log messages."""

    # Patterns to identify sensitive information in logs
    SENSITIVE_PATTERNS = [r"(?i)password\s*=\s*\S+"]

    def filter(self, record: logging.LogRecord) -> bool:
        """Remove sensitive information from log messages.

        Args:
            record (logging.LogRecord): The log record to filter.

        Returns:
            bool: Always True to allow the log record to pass.
        """
        if hasattr(record, "msg"):
            record.msg = self.sanitize(record.msg)
        return True

    def sanitize(self, msg: str) -> str:
        """Sanitize sensitive information from a message.

        Args:
            msg (str): The log message to sanitize.

        Returns:
            str: The sanitized log message.
        """
        for pattern in self.SENSITIVE_PATTERNS:
            msg = re.sub(pattern, "password=****", msg)
        return msg
