from fastapi import FastAPI

from server.backend.routers import companies

app = FastAPI()

# Include the companies router
app.include_router(companies.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend!"}
