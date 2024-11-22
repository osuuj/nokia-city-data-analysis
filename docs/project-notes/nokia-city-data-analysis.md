---
title: "Project: Nokia City Data Analysis"
tags: [macro, project, data-analysis, nokia]
created: 2024-11-22
last-updated: 2024-11-22
deadline: 2025-01-31
priority: moderate
status: "in-progress"
version: 1.0
owner: Juuso Juvonen
progress: 20%
references:
  - "Finnish company data source: [PRH Open Data](https://avoindata.prh.fi/fi) – Provides open data on Finnish companies, including their registration details."
  - "GitHub repository: [osuuj Repository](https://github.com/osuuj) – Contains project-related code and documentation."
---

# Project: Nokia City Data Analysis

---

## Summary

### Purpose
This project aims to create a data analysis and visualization system for Finnish companies, focusing on Nokia city. The system will enable stakeholders to gain actionable insights for decision-making and planning.

---

### Scope
- **Data Acquisition**: Download and preprocess company data from open-source platforms (e.g., [PRH Open Data](https://avoindata.prh.fi/fi)).
- **ETL Pipeline**: Build an automated pipeline to extract, transform, and load the data into a PostgreSQL database.
- **Backend Development**: Develop a FastAPI-based backend for serving company data and analytics.
- **Frontend Development**: Create a React-based interactive website for visualizing company locations and running analytics.

---

### Key Components
1. **Data Sources**: Open data from PRH and other platforms.
2. **Technical Stack**: PostgreSQL, FastAPI, React.
3. **Deliverables**:
   - A cloud-hosted database.
   - An interactive map-based frontend for visualizations.
   - Robust documentation for system use and maintenance.

---

### Expected Outcomes
- **Enhanced Decision-Making**: Stakeholders can better understand the business landscape in Nokia.
- **Scalability**: The system will serve as a framework for analyzing data for other cities or industries.
- **Efficiency**: Automates data ingestion, transformation, and delivery, reducing manual effort.

---

## Goals

### Data Preparation
- [ ] Download and validate Finnish company data from [PRH Open Data](https://avoindata.prh.fi/fi) by 2024-11-23.  
  *Status: Not Started*
- [ ] Write scripts to automate the data download process and save the results as `raw_data.csv` by 2024-11-24.  
  *Status: Not Started*

---

### ETL Pipeline
- [ ] Develop a Python ETL pipeline to:
  - Extract raw data from `raw_data.csv`.
  - Transform the data to meet PostgreSQL schema requirements.
  - Load the data into PostgreSQL as a `company_data` table by 2024-11-25.  
  *Status: In Progress*
- [ ] Write unit tests for ETL components to ensure reliability by 2024-11-27.  
  *Status: Not Started*

---

### Backend Development
- [ ] Set up a FastAPI backend and connect it to the PostgreSQL database by 2024-12-03.  
  *Status: Not Started*
- [ ] Develop API endpoints for:
  - Fetching company locations.
  - Running analytics queries by 2024-12-10.  
  *Status: Not Started*

---

### Frontend Development
- [ ] Create a React-based website for displaying company locations on an interactive map by 2024-12-15.  
  *Status: Not Started*
- [ ] Integrate the website with FastAPI endpoints for real-time data access by 2024-12-20.  
  *Status: Not Started*

---

### Deployment and Documentation
- [ ] Deploy the PostgreSQL database and FastAPI backend to a cloud platform (e.g., AWS, Heroku) by 2024-12-25.  
  *Status: Not Started*
- [ ] Host the React frontend on a platform like Netlify or Vercel by 2024-12-27.  
  *Status: Not Started*
- [ ] Document the workflow, including setup instructions and API details, by 2024-12-31.  
  *Status: Not Started*

---

## Steps to Achieve Goals

### 1. Data Preparation
- Identify open-source platforms providing Finnish company data (e.g., [PRH Open Data](https://avoindata.prh.fi/fi)).
- Download sample datasets and validate the data for format, encoding, and completeness.
- Write Python scripts to:
  - Automate the data download process.
  - Save the raw data as `raw_data.csv`.
- **Deliverable**: `raw_data.csv` containing valid company data.

---

### 2. ETL Pipeline
#### Extraction
- Write a Python script to parse data from `raw_data.csv`.
- Validate extracted data for missing or invalid fields.

#### Transformation
- Clean the data:
  - Standardize field names (e.g., company name, location).
  - Remove duplicates and fill missing values where applicable.
- Convert the cleaned data into a PostgreSQL-compatible format.

#### Loading
- Write SQL scripts to:
  - Create PostgreSQL tables for `company_data`.
  - Load the cleaned data into the database.

#### Finalize
- Add logging and error handling to the ETL script.
- Write unit tests for all ETL stages.
- **Deliverable**: `etl_pipeline.py` script, `company_data` table in PostgreSQL.

---

### 3. Backend Development
- Set up a Python virtual environment for the FastAPI backend.
- Install dependencies:
  - `fastapi`, `uvicorn`, `asyncpg`, etc.
- Develop RESTful API endpoints:
  - `/companies`: Fetch company locations.
  - `/analytics`: Retrieve analytics results.
- Write integration tests for each endpoint.
- **Deliverable**: A running FastAPI backend with functional endpoints.

---

### 4. Frontend Development
- Set up a React project using `create-react-app`.
- Install required libraries:
  - `axios` for API calls.
  - `leaflet` for map visualizations.
- Build components:
  - Map to display company locations.
  - Filter controls for user input (e.g., industry type, region).
- Integrate the frontend with the FastAPI backend.
- **Deliverable**: A React app displaying company locations interactively.

---

### 5. Deployment and Documentation
#### Deployment
- Deploy the PostgreSQL database and FastAPI backend:
  - Use AWS or Heroku for hosting.
  - Ensure proper authentication and scalability.
- Host the React frontend:
  - Use platforms like Vercel or Netlify.
  - Connect it to the backend via API.

#### Documentation
- Create detailed documentation:
  - How to set up the database, backend, and frontend.
  - API usage guide with examples.
  - System architecture diagram.
- **Deliverable**: A complete system deployed online and documented for users and developers.

---

## Progress Log

### Completed Tasks
- **2024-11-22**:
  - **Task**: Initial project setup.
  - **Outcome**: Created folder structure and downloaded sample datasets.
  - **Notes**: No issues encountered.

---

### Planned Tasks
- **2024-11-23**:
  - **Task**: Write a script to download raw data files automatically.
  - **Expected Outcome**: A Python script (`data_download.py`) that saves data as `raw_data.csv`.
  - **Dependencies**: Valid sample datasets.

---

## Reporting

### Highlights
- Successfully finalized the PRH Open Data source for company information.
- Initial project structure and environment setup completed.

---

### Milestones
| Milestone                  | Target Date | Status       | Notes                            |
|----------------------------|-------------|--------------|----------------------------------|
| Data Source Selection      | 2024-11-24  | Completed    | PRH Open Data finalized.         |
| ETL Pipeline Completion    | 2024-11-27  | In Progress  | Data extraction script underway. |

---

## Risks and Mitigation

| Risk                               | Likelihood | Impact  | Mitigation                              |
|------------------------------------|------------|---------|------------------------------------------|
| **Inconsistent data formats**      | High       | Medium  | Develop a preprocessing script to clean and standardize data formats. |

---

## Documentation Outline

### 1. Overview
- Purpose: Brief summary of the project.

---

This layout uses `---` consistently to separate sections, improving readability in Markdown preview mode. Let me know if you'd like any further refinements! 😊
