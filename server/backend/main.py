"""This module initializes the FastAPI application and includes the routers for the API endpoints.

- Sets up application configurations and middleware.
- Includes all routers for modular API structure.
- Defines the root endpoint with a welcome message.

"""

from typing import Dict

from fastapi import FastAPI

from server.backend.routers import companies

# Initialize FastAPI application
app = FastAPI(debug=True, title="Nokia City Data API", version="1.0.0")

# Include the companies router
app.include_router(companies.router, prefix="/api/v1", tags=["Companies"])


@app.get("/", response_model=Dict[str, str])
def read_root() -> Dict[str, str]:
    """Root endpoint that returns a welcome message.

    Returns:
        Dict[str, str]: A dictionary containing a welcome message.
    """
    return {"message": "Welcome to the Nokia City Data API!"}
