"""Cache utility module.

This module provides a simple in-memory cache with time-to-live (TTL) support.
"""

import logging
import time
from dataclasses import dataclass
from functools import wraps
from typing import Any, Callable, Dict, Optional, TypeVar

# Configure logger
logger = logging.getLogger(__name__)

# Type definitions
T = TypeVar("T")
CacheKey = str
CacheValue = Any


@dataclass
class CacheEntry:
    """Cache entry with value and expiration time."""

    value: Any
    expires_at: float


class Cache:
    """Simple in-memory cache with TTL support."""

    def __init__(self):
        """Initialize an empty cache."""
        self._cache: Dict[CacheKey, CacheEntry] = {}

    def get(self, key: CacheKey) -> Optional[Any]:
        """Get a value from cache if it exists and hasn't expired.

        Args:
            key: Cache key

        Returns:
            Cached value or None if not found or expired
        """
        if key not in self._cache:
            return None

        entry = self._cache[key]
        current_time = time.time()

        # Check if entry has expired
        if entry.expires_at < current_time:
            # Remove expired entry
            del self._cache[key]
            return None

        return entry.value

    def set(self, key: CacheKey, value: Any, ttl_seconds: int = 300) -> None:
        """Set a value in cache with TTL.

        Args:
            key: Cache key
            value: Value to cache
            ttl_seconds: Time to live in seconds (default: 5 minutes)
        """
        expires_at = time.time() + ttl_seconds
        self._cache[key] = CacheEntry(value=value, expires_at=expires_at)

    def delete(self, key: CacheKey) -> None:
        """Delete a value from cache.

        Args:
            key: Cache key to delete
        """
        if key in self._cache:
            del self._cache[key]

    def clear(self) -> None:
        """Clear all cache entries."""
        self._cache.clear()


# Create a global cache instance
cache = Cache()


def cached(ttl_seconds: int = 300):
    """Decorator to cache function results.

    Args:
        ttl_seconds: Time to live in seconds (default: 5 minutes)

    Returns:
        Decorated function
    """

    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> T:
            # Create a cache key from function name and arguments
            key = f"{func.__name__}:{str(args)}:{str(kwargs)}"

            # Check if result is in cache
            cached_result = cache.get(key)
            if cached_result is not None:
                logger.debug(f"Cache hit for {key}")
                return cached_result

            # Get fresh result
            logger.debug(f"Cache miss for {key}")
            result = await func(*args, **kwargs)

            # Cache the result
            cache.set(key, result, ttl_seconds)
            return result

        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> T:
            # Create a cache key from function name and arguments
            key = f"{func.__name__}:{str(args)}:{str(kwargs)}"

            # Check if result is in cache
            cached_result = cache.get(key)
            if cached_result is not None:
                logger.debug(f"Cache hit for {key}")
                return cached_result

            # Get fresh result
            logger.debug(f"Cache miss for {key}")
            result = func(*args, **kwargs)

            # Cache the result
            cache.set(key, result, ttl_seconds)
            return result

        # Return appropriate wrapper based on whether the function is async or not
        if "async" in func.__code__.co_flags:
            return async_wrapper
        return sync_wrapper

    return decorator
