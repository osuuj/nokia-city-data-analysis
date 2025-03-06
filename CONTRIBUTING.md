# CONTRIBUTING

Thank you for contributing to this project! We appreciate your time and effort to improve the codebase. Below are the guidelines to help you contribute effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style Guidelines](#code-style-guidelines)
4. [Submitting Changes](#submitting-changes)
5. [Code of Conduct](#code-of-conduct)

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/osuuj/nokia-city-data-analysis.git
   cd nokia-city-data-analysis
   ```

2. Set up a virtual environment and install dependencies (ETL pipeline requirements are located in the `etl` folder and FastAPIs requirements are located in the `server` folder):

   Set up the ETL environment:

   ```bash
   python -m venv venvs/etl_env
   source venvs/etl_env/bin/activate  # Use `venvs\etl_env\Scripts\activate` on Windows
   pip install -r etl/requirements.txt
   ```

   Set up the FastAPI environment:

   ```bash
   python -m venv venvs/fastapi_env
   source venvs/fastapi_env/bin/activate  # Use `venvs\etl_env\Scripts\activate` on Windows
   pip install -r server/requirements.txt
   ```

3. Run the ETL process:

   - Make sure you are in the `etl_env` environment.
   - Execute the ETL pipeline script:
     ```bash
     python etl/scripts/etl_run.py
     ```

4. Start the database services with Docker:

   ```bash
   docker-compose up -d
   ```

5. Load processed data into the database:

   - Ensure the Docker services are running.
   - While still in the `etl_env` environment, execute the loading script:
     ```bash
     python etl/pipeline/load/load_data.py
     ```

6. Switch to the FastAPI environment:

   ```bash
   source venvs/fastapi_env/bin/activate  # Use `venvs\fastapi_env\Scripts\activate` on Windows
   ```

7. Run the FastAPI server:

   ```bash
   uvicorn server.backend.main:app --reload
   ```

8. Access the API documentation:

   - Open your browser and go to: `http://127.0.0.1:8000/docs`

9. Test the API:
   - Use the provided `test` folder scripts such as `queries.py` to validate the API and queries.

---

## Development Workflow

1. Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-and-name
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

   - Use `pyright` to enforce type annotations.

4. **Security**:
   - Use `bandit` for security checks.

Run the following commands to check your code:

```bash
ruff check --config ruff.toml etl/config etl/pipeline etl/scripts etl/utils
black --config .black.toml etl/config etl/pipeline etl/scripts etl/utils
isort --settings-path .isort.cfg --verbose etl/config etl/pipeline etl/scripts etl/utils
pyright
darglint etl/config etl/pipeline etl/scripts etl/utils
bandit -r etl
```

To activate `pre-commit` hooks, ensure `.git/hooks/pre-commit` is set up:

```bash
pre-commit install
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
