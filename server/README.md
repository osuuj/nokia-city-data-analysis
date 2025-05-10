# FastAPI Server for Nokia City Data API

This folder contains the FastAPI server for the Nokia City Data API. It provides REST API endpoints for city data analytics, company information, and GeoJSON visualization.

## Features

- ✅ **FastAPI** with Python 3.11+
- 🗄️ **SQLAlchemy 2.0** with async support using `asyncpg`
- 🔄 **Alembic** for database migrations
- 🔐 Environment-based configuration system using Pydantic Settings
- 📊 **Prometheus metrics** for monitoring
- ✨ **CORS** middleware configured for Vercel frontend
- 🧪 **Testing** support with pytest and async test fixtures
- 🚢 **Docker** for containerized deployment
- 📝 **OpenAPI** documentation
- 🦺 **GitHub Actions** for CI/CD

## Project Structure

```
server/
├── backend/               # Application source code
│   ├── routers/           # API endpoints organized by resource
│   │   ├── analytics.py   # Analytics endpoints
│   │   ├── companies.py   # Company data endpoints
│   │   └── ...
│   ├── models/            # SQLAlchemy ORM models
│   ├── schemas/           # Pydantic validation schemas
│   ├── services/          # Business logic layer
│   ├── database.py        # Database connection and session management
│   ├── main.py            # FastAPI application entrypoint
│   └── config.py          # Configuration management
├── alembic/               # Database migrations
│   ├── versions/          # Migration scripts
│   ├── env.py             # Alembic environment configuration
│   └── script.py.mako     # Migration script template
├── tests/                 # Test suite
├── .github/               # GitHub Actions workflows
├── Dockerfile             # Docker build configuration
├── requirements.txt       # Production dependencies
└── alembic.ini            # Alembic configuration
```

## Environment Setup

### Local Development

1. **Create environment file**:

   Create a `.env.dev` file with the following content:

   ```env
   ENVIRONMENT=dev
   POSTGRES_USER=<your-username>
   POSTGRES_PASSWORD=<your-password>
   POSTGRES_DB=<your-database>
   DB_HOST=localhost
   DB_PORT=5432
   BACKEND_CORS_ORIGINS=["http://localhost:3000"]
   DEBUG=true
   LOG_LEVEL=DEBUG
   ```

2. **Setup a virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run database migrations**:

   ```bash
   alembic upgrade head
   ```

4. **Run the server**:

   ```bash
   uvicorn server.backend.main:app --reload
   ```

   The server will be available at http://localhost:8000.
   API documentation will be at http://localhost:8000/docs.

### Running with Docker

1. **Build the Docker image**:

   ```bash
   docker build -t fastapi-server .
   ```

2. **Run the container**:

   ```bash
   docker run -p 8000:8000 --env-file .env.dev fastapi-server
   ```

### Running in Production

In production, environment variables are expected to be provided:

- Via environment variables in the ECS task definition (AWS)
- With proper security groups and network configuration (VPC, subnets)
- With database credentials from AWS Secrets Manager

## API Endpoints

- `GET /api/v1/companies` - Get company data
- `GET /api/v1/analytics/*` - Analytics endpoints
- `GET /health` - Health check for load balancers
- `GET /ready` - Readiness check for container orchestration
- `GET /metrics` - Prometheus metrics for monitoring

## Database Migrations

To generate a new migration after model changes:

```bash
alembic revision --autogenerate -m "Description of changes"
```

To apply migrations:

```bash
alembic upgrade head
```

## Testing

Run the tests with:

```bash
pytest
```

For test coverage:

```bash
pytest --cov=server/backend --cov-report=html
```

## CI/CD Pipeline

The GitHub Actions workflow in `.github/workflows/build-and-deploy.yml` automatically:

1. Runs the test suite
2. Builds a Docker image
3. Pushes to AWS ECR
4. Deploys to ECS (if on `main` branch)

## Monitoring

- **Health check:** `GET /health`
- **Readiness check:** `GET /ready`
- **Prometheus metrics:** `GET /metrics` 