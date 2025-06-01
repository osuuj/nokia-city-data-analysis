"""FastAPI application entrypoint.

This module initializes the FastAPI application, sets up middleware,
includes routers, and configures logging and startup/shutdown events.
"""

import logging
import os
import sys
from contextlib import asynccontextmanager
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
from fastapi.middleware.trustedhost import (  # pyright: ignore[reportMissingImports]
    TrustedHostMiddleware,
)
from fastapi.responses import RedirectResponse  # pyright: ignore[reportMissingImports]
from prometheus_fastapi_instrumentator import (  # pyright: ignore[reportMissingImports]
    Instrumentator,
)
from sqlalchemy import text
from starlette.middleware.base import BaseHTTPMiddleware

from .config import settings
from .database import close_db_connection, create_db_and_tables, engine
from .db import init_db
from .middleware import setup_middlewares
from .routers import analytics, companies, contact, geojson_companies
from .utils.rate_limit import rate_limit_if_production

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

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version=settings.VERSION,
    description="API for managing company data from the Finnish Patent and Registration Office (PRH)",
    docs_url="/docs",  # Always enable docs for development, configure via env in production
)

# Configure uvicorn to trust proxy headers
app.root_path = ""  # Ensure root path is empty
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]
)  # Trust all hosts since we're behind ALB

# Set up Prometheus metrics endpoint before any startup events
instrumentator.instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)
logger.info("Prometheus metrics enabled at /metrics")


# Startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} in {settings.ENVIRONMENT} mode")
    try:
        await create_db_and_tables()
        await init_db(engine)
        yield
    except Exception as e:
        logger.error(f"Error during startup: {e}")
        raise
    finally:
        logger.info(f"Shutting down {settings.PROJECT_NAME}")
        await close_db_connection()


app.router.lifespan_context = lifespan

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


# Add HTTPS redirect middleware (must be last to run first)
class SmartHTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """Handle HTTP to HTTPS redirection while preserving health check endpoint.

        Args:
            request (Request): The incoming HTTP request
            call_next: The next middleware in the chain

        Returns:
            Response: Either a redirect response to HTTPS or the result of the next middleware
        """
        # Skip redirect for health checks and API endpoints
        if request.url.path.startswith("/api/") or request.url.path == "/health":
            return await call_next(request)

        # Only redirect if we're in production and the request is HTTP
        if (
            os.environ.get("ENVIRONMENT", "dev") == "production"
            and request.url.scheme == "http"
        ):
            return RedirectResponse(url=str(request.url.replace(scheme="https")))

        return await call_next(request)


app.add_middleware(SmartHTTPSRedirectMiddleware)

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
app.include_router(
    contact.router,
    prefix=f"{settings.API_V1_STR}",
    tags=["Contact"],
)

# Check if we're in production environment
is_production = os.environ.get("ENVIRONMENT", "dev") != "dev"


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


@app.get("/api/health")
@rate_limit_if_production(settings.RATE_LIMIT_HEALTH)
async def api_health_check(request: Request) -> Dict[str, str]:
    """Health check endpoint for load balancer (non-redirect)."""
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}


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


@app.get("/api/v1/health")
@rate_limit_if_production(settings.RATE_LIMIT_HEALTH)
async def health_check(request: Request) -> Dict[str, str]:
    """Health check endpoint for load balancers and monitoring.

    Args:
        request: The incoming HTTP request object.

    Returns:
        Dict[str, str]: A dictionary containing the health status.
    """
    try:
        # Test database connection with SSL
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}


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
