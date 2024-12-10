"""Custom logging filters.

This module provides filters to manage log output, including filtering
specific log messages and sanitizing sensitive information.
"""

import logging
import re
from typing import List, Tuple, Pattern


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
    SENSITIVE_PATTERNS: List[Tuple[Pattern[str], str]] = [
        (re.compile(r"(password\s*=\s*)[^\s]+", re.IGNORECASE), r"\1[REDACTED]"),
        (re.compile(r"(api_key\s*=\s*)[^\s]+", re.IGNORECASE), r"\1[REDACTED]"),
        (re.compile(r"(token\s*=\s*)[^\s]+", re.IGNORECASE), r"\1[REDACTED]"),
    ]

    def filter(self, record: logging.LogRecord) -> bool:
        """Sanitize sensitive data in the log record message.

        Args:
            record (logging.LogRecord): The log record to filter.

        Returns:
            bool: True to allow the log record, False to suppress it.
        """
        if isinstance(record.msg, str):
            record.msg = self.sanitize(record.msg)
        return True

    def sanitize(self, msg: str, replacement: str = "[REDACTED]") -> str:
        """Sanitize sensitive information from a message.

        Args:
            msg (str): The log message to sanitize.
            replacement (str): The replacement string for sensitive data.

        Returns:
            str: The sanitized log message.
        """
        for pattern, default_replacement in self.SENSITIVE_PATTERNS:
            msg = pattern.sub(
                default_replacement if replacement == "[REDACTED]" else replacement, msg
            )
        return msg
