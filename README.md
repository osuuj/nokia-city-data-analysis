# Nokia City Data Analysis

A comprehensive data analysis system for companies in cities of Finland, providing ETL capabilities, API services, and interactive data visualizations.

## Project Overview

This project provides an end-to-end solution for processing, analyzing, and visualizing business data across Finnish cities. It consists of three main components:

1. **ETL System** - Extracts company data from PRH (Finnish Patent and Registration Office) open data, transforms it according to business rules, and loads it into a PostgreSQL database
2. **FastAPI Server** - Provides RESTful API endpoints for accessing and querying the processed data
3. **Next.js Client** - Delivers an interactive web dashboard for data visualization and analysis

## Key Features

- 🗄️ **Data Processing** - Robust ETL pipeline with advanced data cleaning and transformation of PRH open data
- 🔍 **Business Analytics** - Industry distribution analysis and city comparisons across Finland
- 🌍 **Geospatial Visualization** - Interactive maps with business location data
- 📊 **Data Dashboards** - Customizable dashboards with various visualization options
- 🔄 **Real-time Updates** - Automated data refresh and processing
- 🔐 **Secure API** - FastAPI backend with proper authentication and rate limiting
- 📱 **Responsive Design** - Mobile-friendly front-end application
- ☁️ **Cloud Deployment** - Production-ready setup for AWS (backend) and Vercel (frontend)
- 📡 **Centralized Data Fetching** - React Query-based architecture for efficient data loading and caching

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

## Client Data Fetching Architecture

The client application implements a standardized, React Query-based data fetching architecture:

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  React Components                                    │
│  ┌────────────────┐  ┌────────────────┐             │
│  │                │  │                │             │
│  │  CitySearch    │  │  AnalyticsView │  ...        │
│  │                │  │                │             │
│  └────────┬───────┘  └────────┬───────┘             │
│           │                   │                     │
│           ▼                   ▼                     │
│  ┌──────────────────────────────────────┐          │
│  │                                      │          │
│  │  Specialized API Hooks               │          │
│  │  ┌──────────┐ ┌──────────┐ ┌───────┐ │          │
│  │  │          │ │          │ │       │ │          │
│  │  │ useData  │ │useAnalyt.│ │useCity│ │ ...      │
│  │  │          │ │          │ │Select │ │          │
│  │  └────┬─────┘ └─────┬────┘ └───┬───┘ │          │
│  │       │             │          │     │          │
│  └───────┼─────────────┼──────────┼─────┘          │
│          │             │          │                │
│          ▼             ▼          ▼                │
│  ┌──────────────────────────────────────┐          │
│  │                                      │          │
│  │  React Query Hooks                   │          │
│  │  ┌─────────────┐    ┌─────────────┐  │          │
│  │  │             │    │             │  │          │
│  │  │ useApiQuery │    │ useApiGet   │  │ ...      │
│  │  │             │    │             │  │          │
│  │  └──────┬──────┘    └──────┬──────┘  │          │
│  │         │                  │         │          │
│  └─────────┼──────────────────┼─────────┘          │
│            │                  │                    │
│            ▼                  ▼                    │
│  ┌────────────────────────────────────────┐        │
│  │                                        │        │
│  │  HTTP Client / API Utilities           │        │
│  │                                        │        │
│  └────────────────────┬───────────────────┘        │
│                       │                            │
└───────────────────────┼────────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │               │
                │  FastAPI      │
                │  Backend      │
                │               │
                └───────────────┘
```

Key benefits of this architecture:
- **Centralized API access** via a standardized set of hooks
- **Automatic caching and deduplication** of API requests
- **Background prefetching** for improved user experience
- **Consistent loading/error states** across the application
- **Optimized re-rendering** with proper memoization
- **Type safety** with TypeScript integration

## Deployment Architecture

```
                      ┌─────────────────┐
                      │                 │
                      │  GitHub Actions │
                      │  CI/CD          │
                      │                 │
                      └────────┬────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
┌─────────────▼──────────────┐      ┌───────────▼─────────────┐
│                            │      │                         │
│  AWS ECS                   │      │  Vercel                 │
│  (FastAPI Server)          │      │  (Next.js Client)       │
│                            │      │                         │
└─────────────┬──────────────┘      └─────────────────────────┘
              │
┌─────────────▼──────────────┐
│                            │
│  AWS RDS                   │
│  (PostgreSQL Database)     │
│                            │
└────────────────────────────┘
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+ and npm
- Docker and Docker Compose (for local development)
- PostgreSQL 14+ (or use the provided Docker setup)
- AWS account (for production deployment of the backend)
- Vercel account (for production deployment of the frontend)

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
- AWS ECS for deployment
- AWS RDS for database hosting

### Client
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Vercel for deployment

## Deployment

### Backend Deployment (AWS)

The FastAPI backend is deployed to AWS using the following services:
- **ECS (Elastic Container Service)** for running the containerized API
- **RDS (Relational Database Service)** for hosting the PostgreSQL database
- **ECR (Elastic Container Registry)** for storing Docker images
- **ELB (Elastic Load Balancer)** for distributing traffic
- **CloudWatch** for monitoring and logging

Deployment is automated via GitHub Actions workflows in the `.github/workflows` directory.

### Frontend Deployment (Vercel)

The Next.js frontend is deployed to Vercel:
- **Vercel** provides automatic deployments from Git
- **Preview Deployments** for pull requests
- **Edge Network** for global content delivery
- **Serverless Functions** for API routes

## Contributing

We welcome contributions to the Nokia City Data Analysis project! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Nokia for supporting the development of this Finnish city data analysis project
- The Finnish Patent and Registration Office (PRH) for providing open business data
- The FastAPI, Next.js, and Python communities for their excellent documentation
- AWS and Vercel for their robust cloud platforms
- All contributors who have helped shape this project 