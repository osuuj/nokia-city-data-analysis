import os

from server.backend.middleware import limiter

is_production = os.environ.get("ENVIRONMENT", "dev") != "dev"


def rate_limit_if_production(limit_string):
    def decorator(func):
        if (
            os.environ.get("ENVIRONMENT") == "test"
            or os.environ.get("BYPASS_RATE_LIMIT") == "true"
        ):
            return func
        if is_production:
            return limiter.limit(limit_string)(func)
        return func

    return decorator
