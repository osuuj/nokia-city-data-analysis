"""FastAPI application entrypoint.

This module initializes the FastAPI application, sets up middleware,
includes routers, and configures logging and startup/shutdown events.
"""

import logging
import os
import sys
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Dict

from fastapi import (  # pyright: ignore[reportMissingImports]
    FastAPI,
    Request,
    Response,
    status,
)
from fastapi.middleware.cors import (  # pyright: ignore[reportMissingImports]
    CORSMiddleware,
)
from fastapi.responses import RedirectResponse  # pyright: ignore[reportMissingImports]
from prometheus_fastapi_instrumentator import (  # pyright: ignore[reportMissingImports]
    Instrumentator,
)

from .config import settings
from .database import close_db_connection, create_db_and_tables, engine
from .db import init_db
from .middleware import limiter, setup_middlewares
from .routers import analytics, companies, geojson_companies

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout,
)

logger = logging.getLogger(__name__)

# Setup Prometheus metrics
instrumentator = Instrumentator(
    should_group_status_codes=True,
    should_ignore_untemplated=True,
    should_respect_env_var=True,
    should_instrument_requests_inprogress=True,
    excluded_handlers=[".*admin.*", "/metrics"],
    env_var_name="ENABLE_METRICS",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Actions to perform on application startup and shutdown.

    - Initialize database tables
    - Warm up connection pool
    - Log application startup
    - Initialize metrics
    """
    # Startup actions
    logger.info(f"Starting {settings.PROJECT_NAME} in {settings.ENVIRONMENT} mode")

    # Initialize database and schema
    await create_db_and_tables()
    await init_db(engine)

    # Set up metrics endpoint
    instrumentator.instrument(app).expose(
        app, endpoint="/metrics", include_in_schema=False
    )
    logger.info("Prometheus metrics enabled at /metrics")

    yield

    # Shutdown actions
    logger.info(f"Shutting down {settings.PROJECT_NAME}")
    await close_db_connection()


# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version=settings.VERSION,
    description="API for managing company data from the Finnish Patent and Registration Office (PRH)",
    docs_url="/docs",  # Always enable docs for development, configure via env in production
    lifespan=lifespan,
)

# Configure middlewares (including security headers and rate limiting)
setup_middlewares(app)

# Set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    logger.info(
        f"Setting up CORS middleware with origins: {settings.BACKEND_CORS_ORIGINS}"
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

# Include routers (with rate limiting)
app.include_router(
    companies.router,
    prefix=settings.API_V1_STR,
    tags=["companies"],
)
app.include_router(
    analytics.router,
    prefix=f"{settings.API_V1_STR}/analytics",
    tags=["analytics"],
)
app.include_router(
    geojson_companies.router,
    prefix=settings.API_V1_STR,
    tags=["GeoJSON"],
)

# Check if we're in production environment
is_production = os.environ.get("ENVIRONMENT", "dev") != "dev"


# Conditionally create decorator factories
def rate_limit_if_production(limit_string):
    """Apply rate limiting only in production environment.

    In test environments, we completely bypass the rate limiter to avoid
    the 'No request or websocket argument' error during testing.
    """

    def decorator(func):
        # Skip rate limiting in test environment
        if (
            os.environ.get("ENVIRONMENT") == "test"
            or os.environ.get("BYPASS_RATE_LIMIT") == "true"
        ):
            return func

        # Apply rate limiting in production
        if is_production:
            return limiter.limit(limit_string)(func)

        # No rate limiting in development
        return func

    return decorator


@app.get("/", response_model=Dict[str, str])
@rate_limit_if_production(settings.RATE_LIMIT_DEFAULT)
async def read_root(request: Request) -> Dict[str, str]:
    """Root endpoint that returns a welcome message.

    Args:
        request: The incoming HTTP request object.

    Returns:
        Dict[str, str]: A dictionary containing a welcome message.
    """
    logger.debug("Root endpoint accessed")
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}


@app.get("/health")
async def health_redirect():
    """Redirect to the standardized health check endpoint.

    This is kept for backward compatibility.
    """
    return RedirectResponse(url="/api/health")


@app.get("/ready")
async def readiness() -> Response:
    """Readiness check endpoint for load balancers and monitoring.

    Checks if the application is ready to accept traffic by verifying:
    - Database connection is working

    Returns:
        Response: HTTP 200 OK if ready, or 503 Service Unavailable if not
    """
    try:
        # Here we could add a database check if needed
        # e.g., db_check = await check_database_connection()
        return Response(
            content='{"status":"ready", "database":"connected"}',
            media_type="application/json",
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        return Response(
            content='{"status":"not ready", "reason":"database error"}',
            media_type="application/json",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


@app.get("/api/health", tags=["Health"])
@rate_limit_if_production(settings.RATE_LIMIT_HEALTH)
async def health_check():
    """Health check endpoint for monitoring and load balancers.

    This endpoint is used by AWS ECS for container health checks.

    Returns:
        Dict with status information and timestamp
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/api/debug/swagger")
async def debug_swagger():
    """Debug endpoint to check Swagger UI configuration.

    Returns:
        Dict with information about the Swagger UI configuration
    """
    return {
        "openapi_url": f"{settings.API_V1_STR}/openapi.json",
        "docs_url": "/docs",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
        "app_title": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }
