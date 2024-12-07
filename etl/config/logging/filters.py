"""
Custom logging filters.

This module provides filters to manage log output, including filtering
specific log messages and sanitizing sensitive information.
"""

import logging
import re


class ChunkProcessingFilter(logging.Filter):
    def filter(self, record):
        return not record.getMessage().startswith(
            "Processing etl/data/3_processed/chunks/chunk_"
        )


class SensitiveDataFilter(logging.Filter):
    def filter(self, record):
        if hasattr(record, "msg"):
            record.msg = self.sanitize(record.msg)
        return True

    def sanitize(self, msg):
        sensitive_patterns = [r"(?i)password\s*=\s*\S+"]
        for pattern in sensitive_patterns:
            msg = re.sub(pattern, "password=****", msg)
        return msg
