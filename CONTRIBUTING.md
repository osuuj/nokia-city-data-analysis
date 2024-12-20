# CONTRIBUTING

Thank you for contributing to this project! We appreciate your time and effort to improve the codebase. Below are the guidelines to help you contribute effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style Guidelines](#code-style-guidelines)
4. [Running the ETL Pipeline](#running-the-etl-pipeline)
5. [Submitting Changes](#submitting-changes)
6. [Code of Conduct](#code-of-conduct)

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/osuuj/nokia-city-data-analysis.git
   cd nokia-city-data-analysis
   ```

2. Set up a virtual environment and install dependencies (requirements for the ETL pipeline are in the `etl` folder):
   ```bash
   python -m venv venv
   source venv/bin/activate  # Use `venv\Scripts\activate` on Windows
   pip install -r etl/requirements.txt
   ```

3. Ensure you have Docker installed and running on your machine.

4. Familiarize yourself with the project structure.

---

## Development Workflow

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes in your branch and commit them with meaningful commit messages:
   ```bash
   git commit -m "Add feature: Description of the feature"
   ```

3. Push your branch to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a pull request (PR) for your branch into the `main` branch on GitHub.

---

## Code Style Guidelines

Code Style Guidelines are optional, and the tools required are already listed in `requirements.txt`. For code quality, we recommend the following tools:

1. **Linters**:
   - Use `ruff` for linting.
   - Use `darglint` for docstring validation.

2. **Formatting**:
   - Use `black` for code formatting.
   - Use `isort` for organizing imports.

3. **Type Checking**:
   - Use `mypy` to enforce type annotations.

4. **Security**:
   - Use `bandit` for security checks.

Run the following commands to check your code:
```bash
ruff check --config ruff.toml etl/config etl/pipeline etl/scripts etl/utils
black --config .black.toml etl/config etl/pipeline etl/scripts etl/utils
isort --settings-path .isort.cfg --verbose etl/config etl/pipeline etl/scripts etl/utils
mypy --config-file mypy.ini etl/config etl/pipeline etl/scripts etl/utils
darglint etl/config etl/pipeline etl/scripts etl/utils
bandit -r etl
```

To activate `pre-commit` hooks, ensure `.git/hooks/pre-commit` is set up:
```bash
pre-commit install
```

---

## Running the ETL Pipeline

1. Prepare the environment and configurations:
   - Ensure the configuration files are properly set up in the `etl/config` directory.

2. Execute the ETL pipeline:
   ```bash
   python etl/scripts/etl_run.py
   ```

3. Start the database services with Docker:
   ```bash
   docker-compose up -d
   ```

4. Load the processed data into the database (ensure Docker services are running):
   ```bash
   python etl/pipeline/load/load_data.py
   ```

---

## Submitting Changes

1. Ensure your branch is up-to-date with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Resolve any merge conflicts.

3. Push your branch and create a pull request.

4. Add a clear description of your changes in the PR.

---

## Code of Conduct

We strive to maintain a welcoming and inclusive environment. By contributing to this project, you agree to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thank you for contributing to this project! 🚀

