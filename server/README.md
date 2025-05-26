# FastAPI Server for Nokia City Data API

This folder contains the FastAPI server for the Nokia City Data API. It provides REST API endpoints for city data analytics, company information, and GeoJSON visualization.

## Features

- ✅ **FastAPI** with Python 3.12+
- 🗄️ **SQLAlchemy 2.0** with async support using `asyncpg`
- 🔄 **Alembic** for database migrations
- 🔐 Environment-based configuration system using Pydantic Settings
- 📊 **Prometheus metrics** for monitoring
- ✨ **CORS** middleware configured for Vercel frontend
- 🧪 **Testing** support with pytest and async test fixtures
- 🚢 **Docker** with optimized multi-stage builds
- 📝 **OpenAPI** documentation
- 🦺 **GitHub Actions** for CI/CD
- 🔒 **Security** with rate limiting and proper error handling
- 💾 **Caching** mechanisms for improved performance
- 🌐 **GeoJSON** support for map visualization

## Project Structure

```
server/
├── backend/               # Application source code
│   ├── routers/           # API endpoints organized by resource
│   │   ├── analytics.py   # Analytics endpoints
│   │   ├── companies.py   # Company data endpoints
│   │   └── geojson_companies.py # GeoJSON endpoints
│   ├── models/            # SQLAlchemy ORM models
│   ├── schemas/           # Pydantic validation schemas
│   ├── services/          # Business logic layer
│   │   ├── analytics_service.py # Analytics calculations
│   │   ├── company_service.py   # Company data processing
│   │   └── geojson_service.py   # GeoJSON transformations
│   ├── utils/             # Utility functions
│   │   ├── analytics_utils.py  # Analytics helpers
│   │   └── cache.py           # Caching mechanisms
│   ├── database.py        # Database connection and session management
│   ├── main.py            # FastAPI application entrypoint
│   └── config.py          # Configuration management
├── alembic/               # Database migrations
│   ├── versions/          # Migration scripts
│   ├── env.py             # Alembic environment configuration
│   └── script.py.mako     # Migration script template
├── deployment/            # Deployment configurations
│   └── aws-ecs-task-definition.json # AWS ECS task definition
├── tests/                 # Test suite
│   ├── routers/           # Router tests
│   ├── services/          # Service tests
│   └── utils/             # Utility tests
├── .github/               # GitHub Actions workflows
├── Dockerfile             # Production Docker build configuration
├── Dockerfile.dev         # Development Docker configuration
├── requirements.txt       # Production dependencies
├── requirements-dev.txt   # Development dependencies
└── alembic.ini            # Alembic configuration
```

## Environment Setup

### Prerequisites

- Python 3.12+
- PostgreSQL 14+ (or use the provided Docker setup)
- Docker and Docker Compose (for local development)

### Local Development with Docker Compose (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/your-org/nokia-city-data-analysis.git
cd nokia-city-data-analysis

# Start the database and server containers
docker-compose up
```

This will start:
- A PostgreSQL database
- The FastAPI server with live-reload for development

The server will be available at http://localhost:8000 with API documentation at http://localhost:8000/docs.

### Manual Development Setup

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
   pip install -r requirements-dev.txt  # For development tools
   ```

3. **Run database migrations**:

   ```bash
   alembic upgrade head
   ```

4. **Run the server**:

   ```bash
   uvicorn server.backend.main:app --reload
   ```

### Docker Configurations

The project includes two Docker configurations:

1. **Development (Dockerfile.dev)**:
   - Includes development dependencies
   - Live code reloading with volume mounts
   - Debug logging enabled
   - Used by docker-compose.yml for local development

2. **Production (Dockerfile)**:
   - Multi-stage build for smaller image size
   - Excludes development dependencies and testing files
   - Optimized for security and performance
   - Used for AWS deployment

To build and run the production Docker image:

```bash
docker build -t fastapi-server .
docker run -p 8000:8000 --env-file .env.prod fastapi-server
```

To build and run the development Docker image:

```bash
docker build -f Dockerfile.dev -t fastapi-server-dev .
docker run -p 8000:8000 --env-file .env.dev -v $(pwd):/app fastapi-server-dev
```

## Production Deployment

### AWS ECS Deployment

The server is designed to be deployed to AWS ECS using the GitHub Actions workflow:

1. Push to the `main` branch triggers the workflow
2. Tests are run against a test database
3. Docker image is built and pushed to AWS ECR
4. ECS service is updated with the new image

Required GitHub Secrets:
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `AWS_REGION` - The AWS region to deploy to
- `ECR_REPOSITORY` - The ECR repository name
- `ECS_CLUSTER` - The ECS cluster name
- `ECS_SERVICE` - The ECS service name
- `ECS_TASK_DEFINITION` - The ECS task definition name

### Environment Configuration

In production, environment variables are provided through:
- AWS ECS Task Definition environment variables
- AWS Secrets Manager for sensitive values

Required environment variables:
```env
ENVIRONMENT=production
DATABASE_URL=postgresql+asyncpg://user:password@db-host:5432/db-name
BACKEND_CORS_ORIGINS=["https://your-frontend-domain.com"]
PORT=8000
WORKERS=4  # Adjust based on instance size
LOG_LEVEL=INFO
```

## API Endpoints

The API provides several categories of endpoints:

### Company Data
- `GET /api/v1/businesses_by_city?city={city}` - Get businesses in a specific city
- `GET /api/v1/businesses_by_industry?industry_letter={industry}` - Get businesses in a specific industry
- `GET /api/v1/cities` - Get all cities
- `GET /api/v1/industries` - Get all industries

### Analytics
- `GET /api/v1/analytics/industry-distribution` - Get overall industry distribution
- `GET /api/v1/analytics/city-comparison?cities={city1,city2,city3}` - Compare cities
- `GET /api/v1/analytics/industries-by-city` - Get industry distribution by city
- `GET /api/v1/analytics/top-cities` - Get top cities by company count
- `GET /api/v1/analytics/industry_comparison_by_cities?city1={city1}&city2={city2}` - Compare industries between cities

### GeoJSON
- `GET /api/v1/companies.geojson?city={city}&limit={limit}` - Get companies as GeoJSON for map visualization

### Health and Monitoring
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

## Client Integration

The server is designed to work with a Next.js frontend deployed on Vercel. See `client/ENV_SETUP.md` for detailed instructions on configuring the client to work with both local development and production AWS-hosted backend.

## Monitoring

- **Health check:** `GET /health`
- **Readiness check:** `GET /ready`
- **Prometheus metrics:** `GET /metrics`

## Security

- **Rate limiting** is applied to API endpoints in production
- **CORS** is configured to allow only specified origins
- **Database credentials** are securely managed
- **SQL injection** protections with proper SQLAlchemy usage 