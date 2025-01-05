from typing import Dict

from fastapi import FastAPI

from server.backend.routers import companies

app = FastAPI()

# Include the companies router
app.include_router(companies.router)


@app.get("/", response_model=Dict[str, str])
def read_root() -> Dict[str, str]:
    return {"message": "Welcome to the FastAPI backend!"}
