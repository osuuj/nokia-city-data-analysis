# Nokia City Data Analysis

A comprehensive data analysis system for Nokia City Data, providing ETL capabilities, API services, and interactive data visualizations.

![Project Banner](client/public/images/project-banner.png)

## Project Overview

This project provides an end-to-end solution for processing, analyzing, and visualizing city business data. It consists of three main components:

1. **ETL System** - Extracts data from various sources, transforms it according to business rules, and loads it into a PostgreSQL database
2. **FastAPI Server** - Provides RESTful API endpoints for accessing and querying the processed data
3. **Next.js Client** - Delivers an interactive web dashboard for data visualization and analysis

## Key Features

- 🗄️ **Data Processing** - Robust ETL pipeline with advanced data cleaning and transformation
- 🔍 **Business Analytics** - Industry distribution analysis and city comparisons
- 🌍 **Geospatial Visualization** - Interactive maps with business location data
- 📊 **Data Dashboards** - Customizable dashboards with various visualization options
- 🔄 **Real-time Updates** - Automated data refresh and processing
- 🔐 **Secure API** - FastAPI backend with proper authentication and rate limiting
- 📱 **Responsive Design** - Mobile-friendly front-end application

## System Architecture

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│               │    │               │    │               │
│  ETL System   │───▶│  PostgreSQL   │◀───│  FastAPI      │
│  (Python)     │    │  Database     │    │  Server       │
│               │    │               │    │               │
└───────────────┘    └───────────────┘    └───────┬───────┘
                                                  │
                                                  ▼
                                          ┌───────────────┐
                                          │               │
                                          │  Next.js      │
                                          │  Client       │
                                          │               │
                                          └───────────────┘
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+ and npm
- Docker and Docker Compose (for local development)
- PostgreSQL 14+ (or use the provided Docker setup)

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/osuuj/nokia-city-data-analysis.git
   cd nokia-city-data-analysis
   ```

2. **Set up the development environment**:

   We provide helper scripts to set up each component:

   ```bash
   # Set up ETL environment
   ./etl/scripts/setup_dev_env.sh

   # Set up FastAPI environment
   ./server/scripts/setup_dev_env.sh
   ```

3. **Start the database**:

   ```bash
   docker-compose up -d
   ```

4. **Run the ETL pipeline** (extract, transform, load):

   ```bash
   source venvs/etl_env/bin/activate
   python -m etl.pipeline.etl_run
   ./etl/scripts/run_etl_load.sh
   ```

5. **Start the FastAPI server**:

   ```bash
   source venvs/fastapi_env/bin/activate
   uvicorn server.backend.main:app --reload
   ```

6. **Start the Next.js client**:

   ```bash
   cd client
   npm install
   npm run dev
   ```

7. **Access the application**:
   - Web Dashboard: http://localhost:3000
   - API Documentation: http://localhost:8000/docs

For detailed setup instructions, refer to component-specific documentation:
- [ETL System Documentation](etl/README.md)
- [Server Documentation](server/README.md)
- [Client Documentation](client/README.md)

## Project Structure

```
nokia-city-data-analysis/
├── etl/                  # ETL system for data processing
│   ├── config/           # Configuration files
│   ├── pipeline/         # ETL pipeline components
│   ├── data/             # Data directories
│   └── scripts/          # Helper scripts
├── server/               # FastAPI server
│   ├── backend/          # API implementation
│   │   ├── routers/      # API endpoints
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── alembic/          # Database migrations
│   └── tests/            # API tests
├── client/               # Next.js client application
│   ├── app/              # Next.js App Router
│   ├── features/         # Feature-specific code
│   ├── shared/           # Shared components
│   └── public/           # Static assets
├── .github/              # GitHub Actions workflows
├── docker-compose.yml    # Docker Compose configuration
└── venvs/                # Python virtual environments
```

## Technologies Used

### ETL System
- Python 3.12
- Pandas for data processing
- YAML for configuration
- Docker for containerization

### Server
- FastAPI for API endpoints
- SQLAlchemy for ORM
- Alembic for migrations
- PostgreSQL for database
- Pydantic for validation

### Client
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Query

## Contributing

We welcome contributions to the Nokia City Data Analysis project! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Nokia for providing the city data
- The FastAPI, Next.js, and Python communities for their excellent documentation
- All contributors who have helped shape this project 