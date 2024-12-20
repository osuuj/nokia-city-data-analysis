# CONTRIBUTING

Thank you for contributing to this project! We appreciate your time and effort to improve the codebase. Below are the guidelines to help you contribute effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style Guidelines](#code-style-guidelines)
4. [Running the ETL Pipeline](#running-the-etl-pipeline)
5. [Using Clean Coding Tools](#using-clean-coding-tools)
6. [Submitting Changes](#submitting-changes)
7. [Code of Conduct](#code-of-conduct)

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Set up a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Use `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
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
Use these commands before pushing your branch to the remote repository.
We follow these code style guidelines to ensure consistency:

1. **Linters**:
   - Use `ruff` for linting.
   - Use `darglint` for docstring validation.

2. **Formatting**:
   - Use `black` for code formatting.
   - Use `isort` for organizing imports.

3. **Type Checking**:
   - Use `mypy` to enforce type annotations.

Run the following commands to check your code:
```bash
ruff check --config ruff.toml etl/config etl/pipeline etl/scripts etl/utils
black --config .black.toml etl/config etl/pipeline etl/scripts etl/utils
isort --settings-path .isort.cfg --verbose etl/config etl/pipeline etl/scripts etl/utils
mypy --config-file mypy.ini etl/config etl/pipeline etl/scripts etl/utils
darglint etl/config etl/pipeline etl/scripts etl/utils
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

## Using Clean Coding Tools

To ensure high code quality, we use the following clean coding tools with `pre-commit` hooks:

1. Add the following configuration to your `.pre-commit-config.yaml` file:
   ```yaml
   - repo: https://github.com/psf/black
     rev: 24.10.0
     hooks:
       - id: black
         args: ["--config", ".black.toml"]

   - repo: https://github.com/charliermarsh/ruff-pre-commit
     rev: v0.8.2
     hooks:
       - id: ruff
         args: ["--config", "ruff.toml"]

   - repo: https://github.com/pre-commit/mirrors-isort
     rev: v5.10.1
     hooks:
       - id: isort
         args: ["--settings-path", ".isort.cfg"]

   - repo: https://github.com/pre-commit/mirrors-mypy
     rev: v1.13.0
     hooks:
       - id: mypy
         args: ["--config-file", "mypy.ini", "--exclude", "test/", "etl/data", "--install-types", "--non-interactive"]
         additional_dependencies:
         - pydantic[mypy]

   - repo: https://github.com/terrencepreilly/darglint
     rev: v1.8.1
     hooks:
       - id: darglint
         args: ["--docstring-style", "google"]
         exclude: ^etl/test/|^etl/data/

   - repo: https://github.com/PyCQA/bandit
     rev: 1.8.0
     hooks:
       - id: bandit
         args: ["--configfile", "bandit.yaml"]
         exclude: ^etl/test/|^etl/data/
   ```

2. Install `pre-commit`:
   ```bash
   pip install pre-commit
   ```

3. Install the hooks:
   ```bash
   pre-commit install
   ```

4. Run the hooks manually (if needed):
   ```bash
   pre-commit run --all-files
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
