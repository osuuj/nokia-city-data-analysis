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

- **Backend**: Python, FastAPI, PostgreSQL
- **Frontend**: React, Leaflet.js
- **Database**: PostgreSQL (cloud-hosted)
- **Hosting**: AWS, Heroku (backend), Netlify/Vercel (frontend)
- **Other Tools**: Git, pytest, Docker (for containerization)

---

## System Architecture

1. **Data Sources**:
   - [PRH Open Data](https://avoindata.prh.fi/fi) – Open data on Finnish companies.

2. **ETL Pipeline**:
   - Extract raw data from open sources.
   - Transform and clean data to meet database requirements.
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
| ETL Pipeline Completion    | 2024-11-27  | In Progress  |
| Backend Setup              | 2024-12-03  | Not Started  |
| Frontend Prototype         | 2024-12-15  | Not Started  |
| Full System Deployment     | 2024-12-27  | Not Started  |

---

## Installation and Setup

### Prerequisites

- **Python 3.9+**
- **Node.js 14+**
- **PostgreSQL 13+**
- **Docker** (optional, for containerization)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/osuuj/nokia-city-data-analysis.git
   cd nokia-city-data-analysis
