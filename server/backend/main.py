"""This module initializes the FastAPI application and includes the routers for the API endpoints."""

from typing import Dict

from fastapi import FastAPI

from server.backend.routers import companies

app = FastAPI(debug=True)  # Enable debug mode

# Include the companies router
app.include_router(companies.router)


@app.get("/", response_model=Dict[str, str])
def read_root() -> Dict[str, str]:
    """Root endpoint that returns a welcome message.

    Returns:
        Dict[str, str]: A dictionary containing a welcome message.
    """
    return {"message": "Welcome to the FastAPI backend!"}
