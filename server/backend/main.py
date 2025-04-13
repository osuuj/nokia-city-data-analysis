from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import create_db_and_tables
from .routers import analytics, companies, geojson_companies

# Create database tables on startup if they don't exist
# create_db_and_tables()

# ✅ Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version="0.1.0",
    description="API for managing company data from the Finnish Patent and Registration Office (PRH)",
)

# Set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(companies.router, prefix=settings.API_V1_STR, tags=["companies"])
app.include_router(
    analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"]
)
app.include_router(
    geojson_companies.router, prefix=settings.API_V1_STR, tags=["GeoJSON"]
)


@app.on_event("startup")
async def startup_event():
    # Optional: Actions to perform on startup, e.g., connect to DB pool
    print("Application startup...")
    create_db_and_tables()  # Ensure tables are created


@app.get("/", response_model=Dict[str, str])
def read_root() -> Dict[str, str]:
    """Root endpoint that returns a welcome message.

    Returns:
        Dict[str, str]: A dictionary containing a welcome message.
    """
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
