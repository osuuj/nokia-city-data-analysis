from typing import Dict

from fastapi import FastAPI

from server.backend.routers import companies

# ✅ Initialize FastAPI application
app = FastAPI(debug=True, title="Nokia City Data API", version="1.0.0")

# ✅ Include optimized companies router
app.include_router(companies.router, prefix="/api/v1", tags=["Companies"])


@app.get("/", response_model=Dict[str, str])
def read_root() -> Dict[str, str]:
    """Root endpoint that returns a welcome message.

    Returns:
        Dict[str, str]: A dictionary containing a welcome message.
    """
    return {"message": "Welcome to the Nokia City Data API!"}
