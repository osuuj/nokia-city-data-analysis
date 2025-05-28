"""Middleware for the FastAPI application.

This module contains middleware components for:
- Security headers to protect against common web vulnerabilities
- Rate limiting to prevent API abuse
"""

import os
import time
from typing import Callable

from fastapi import FastAPI, Request, Response  # pyright: ignore[reportMissingImports]
from slowapi import (  # pyright: ignore[reportMissingImports]
    Limiter,
    _rate_limit_exceeded_handler,
)
from slowapi.errors import RateLimitExceeded  # pyright: ignore[reportMissingImports]
from slowapi.util import get_remote_address  # pyright: ignore[reportMissingImports]
from starlette.middleware.base import (  # pyright: ignore[reportMissingImports]
    BaseHTTPMiddleware,
)
from starlette.types import ASGIApp  # pyright: ignore[reportMissingImports]

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
# Rate limiting will be conditionally enabled in setup_middlewares based on environment


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware that adds security headers to every response."""

    def __init__(
        self,
        app: ASGIApp,
        hsts_max_age: int = 31536000,  # 1 year in seconds
        include_subdomains: bool = True,
    ):
        """Initialize security headers middleware.

        Args:
            app: The ASGI application to wrap
            hsts_max_age: The max age for HSTS in seconds
            include_subdomains: Whether to include subdomains in HSTS
        """
        super().__init__(app)
        self.hsts_max_age = hsts_max_age
        self.include_subdomains = include_subdomains

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Add security headers to the response."""
        response = await call_next(request)

        # Add security headers
        # X-Content-Type-Options prevents MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # X-Frame-Options prevents clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # X-XSS-Protection enables browser XSS filtering
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer-Policy controls what referrer information is sent
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Environment-specific Content Security Policy (CSP)
        environment = os.environ.get("ENVIRONMENT", "dev")
        is_docs_path = request.url.path.startswith("/docs")
        is_health_check = request.url.path == "/api/health"

        # Set appropriate CSP based on environment
        if environment == "production" or environment == "staging":
            # Skip strict CSP for Swagger docs even in production
            if not is_docs_path:
                # Strict CSP for production environment
                response.headers["Content-Security-Policy"] = (
                    "default-src 'self'; "
                    "img-src 'self' data:; "
                    "script-src 'self'; "  # No unsafe-inline/eval in production
                    "style-src 'self'; "
                    "font-src 'self' data:; "
                    "connect-src 'self' https://api.osuuj.ai; "  # Allow API calls to backend
                    "frame-ancestors 'none'; "
                    "object-src 'none'; "
                    "base-uri 'self'"
                )

                # Permissions-Policy restricts browser features
                response.headers["Permissions-Policy"] = (
                    "accelerometer=(), "
                    "camera=(), "
                    "geolocation=(), "
                    "gyroscope=(), "
                    "magnetometer=(), "
                    "microphone=(), "
                    "payment=(), "
                    "usb=()"
                )
        elif environment == "dev" or environment == "test":
            # For development: either no CSP or a relaxed one for tooling
            # Docs automatically get relaxed CSP by skipping the check above
            if not is_docs_path:
                # Relaxed CSP for development environment - allows dev tools to work
                response.headers["Content-Security-Policy"] = (
                    "default-src 'self'; "
                    "img-src 'self' data: blob: *; "  # Allow any images for dev
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "  # Allow for dev tools
                    "style-src 'self' 'unsafe-inline'; "  # Allow for dev tools
                    "font-src 'self' data: *; "  # Allow any fonts for dev
                    "connect-src 'self' *; "  # Allow any APIs for dev
                    "worker-src 'self' blob: data:; "  # For dev tools
                    "frame-src 'self' *"  # For dev tools
                )

        # HSTS tells browsers to only use HTTPS (only in production and not for health check)
        if request.url.scheme == "https" and not is_health_check:
            hsts_value = f"max-age={self.hsts_max_age}"
            if self.include_subdomains:
                hsts_value += "; includeSubDomains"
            response.headers["Strict-Transport-Security"] = hsts_value

        return response


class ProcessTimeMiddleware(BaseHTTPMiddleware):
    """Middleware that adds processing time to response headers."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Add X-Process-Time header to the response."""
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response


def setup_middlewares(app: FastAPI) -> None:
    """Configure middleware for the FastAPI application.

    Args:
        app (FastAPI): The FastAPI application instance.
    """
    # Add security headers middleware
    app.add_middleware(SecurityHeadersMiddleware)

    # Add processing time middleware
    app.add_middleware(ProcessTimeMiddleware)

    # Set up rate limiter regardless of environment (needed for decorator references)
    app.state.limiter = limiter

    # Only enable rate limiting in production environment
    environment = os.environ.get("ENVIRONMENT", "dev")
    if environment != "dev":
        # Add rate limit exceeded handler in production
        app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
        print(f"Rate limiting enabled in {environment} environment")
