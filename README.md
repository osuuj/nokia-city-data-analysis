# Nokia City Data Analysis

## Overview

This project aims to develop a data analysis and visualization system for Finnish companies, focusing on Nokia city. The system provides actionable insights for decision-making and planning by automating data ingestion, transformation, and visualization.

---

## Features

- **Data Acquisition**: Automated downloading and preprocessing of open company data.
- **ETL Pipeline**: A Python-based pipeline to extract, transform, and load data into a PostgreSQL database.
- **Backend**: FastAPI-based server to provide RESTful APIs for accessing and analyzing company data.
- **Frontend**: React-based web application with an interactive map for visualizing company locations.

---

## Technical Stack

- **Backend**: Python (3.12), FastAPI, PostgreSQL
- **Frontend**: React (Leaflet.js is under consideration)
- **Database**: PostgreSQL (cloud-hosted)
- **Other Tools**: Git, pytest, Docker (for containerization), Bandit

---

## System Architecture

1. **Data Sources**:
   - [PRH Open Data](https://avoindata.prh.fi/fi) – Open data on Finnish companies.

2. **ETL Pipeline**:
   - Extract raw data from open sources.
   - Transform and clean data to meet database requirements (some memory optimizations needed in the cleaning process).
   - Load data into a PostgreSQL database.

3. **Backend API**:
   - RESTful endpoints to fetch company data and run analytics.

4. **Frontend**:
   - Interactive map visualization and data filters for user exploration.

---

## Project Goals

### Milestones

| Milestone                  | Target Date | Status       |
|----------------------------|-------------|--------------|
| Data Preparation           | 2024-11-24  | Completed    |
| ETL Pipeline Completion    | 2024-12-27  | Completed  |
| Backend              | 2025-01-30  | Starting  |
| Frontend Prototype         | 2025-??-??  | Not Started  |
| Full System Deployment     | 2025-??-??  | Not Started  |

---

## Installation and Setup

### Prerequisites

- **Python 3.12**
- **PostgreSQL 13+**
- **Docker**

### Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/osuuj/nokia-city-data-analysis.git
   cd nokia-city-data-analysis
   ```

2. Set up a virtual environment and install dependencies (ETL pipeline requirements are located in the `etl` folder):

   ```bash
   python -m venv venv
   source venv/bin/activate  # Use `venv\Scripts\activate` on Windows
   pip install -r etl/requirements.txt
   ```

3. Create a `.env` file in the root directory with the following variables (update placeholders as needed):

   ```env
   PYTHONPATH=<your-path>/nokia-city-data-analysis
   POSTGRES_DB=<your-db>
   POSTGRES_USER=<your-db-user>
   POSTGRES_PASSWORD=<your-db-password>
   DB_HOST=localhost
   DB_PORT=5432

   ENV=development
   # ENV=production
   CHUNK_SIZE=1000
   ```

---

## File Structure Overview

```
nokia-city-data-analysis/
├── CONTRIBUTING.md               # Contribution guidelines
├── README.md                     # Project overview and setup instructions
├── bandit.yaml                   # Security configuration
├── docker-compose.yml            # Docker Compose configuration
├── mypy.ini                      # Mypy type checker configuration
├── ruff.toml                     # Ruff linter configuration
├── etl/                          # ETL (Extract, Transform, Load) scripts
│   ├── __init__.py
│   ├── config/                   # Configuration files
│   │   ├── __init__.py
│   │   ├── config_loader.py
│   │   ├── db.yml
│   │   ├── directory.yml
│   │   └── ...                   # Additional config files
│   ├── data/                     # Data storage
│   │   ├── 1_raw/
│   │   ├── 2_extracted/
│   │   ├── 3_processed/
│   │   └── logs/
│   │       ├── etl.log
│   │       └── etl_debug.log
│   ├── pipeline/                 # ETL pipeline scripts
│   │   ├── extract/
│   │   ├── load/
│   │   └── transform/
│   ├── scripts/                  # Execution scripts
│   │   ├── data_fetcher.py
│   │   ├── entity_processing.py
│   │   └── etl_run.py
│   └── utils/                    # Utility modules
│       ├── cleaning_utils.py
│       ├── dynamic_imports.py
│       └── file_system_utils.py
├── frontend/                     # Frontend application
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── components/
│       │   ├── Map.js
│       │   └── SearchForm.js
│       └── services/
│           └── api.js
├── server/                       # Backend server
│   ├── backend/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models/
│   │   │   └── company.py
│   │   ├── routers/
│   │   │   └── companies.py
│   │   ├── schemas/
│   │   │   └── company.py
│   │   └── services/
│   │       └── company_service.py
│   ├── db/
│   │   └── schema.sql
│   ├── requirements.txt          # Backend dependencies
│   └── tests/                    # Test scripts
│       ├── test_db_connection.py
│       └── test_queries.ipynb
└── venvs/                        # Virtual environments
    ├── etl_env/
    ├── fastapi_env/
    └── react_env/

```

