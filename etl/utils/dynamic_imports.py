"""Utility for Dynamically Importing Modules and Functions

This module provides a function to dynamically import a specific function or object
at runtime using its fully qualified name. It decouples dependencies and enables
flexible function resolution, which is especially useful for dynamic ETL pipelines.

Key Features:
- Dynamically resolves functions or objects using string paths.
- Supports modular and extensible workflows by decoupling dependencies.
"""

import importlib
import logging
from typing import Any

logger = logging.getLogger(__name__)


def import_function(func_path: str) -> Any:
    """Dynamically import a function or object given its fully qualified name.

    Args:
        func_path (str): Fully qualified function name
                         (e.g., "module.submodule.function").

    Returns:
        Any: The imported function or object.

    Raises:
        ValueError: If `func_path` is empty or improperly formatted.
        ImportError: If the module cannot be imported.
        AttributeError: If the function or object is not found in the module.

    """
    if not func_path or not isinstance(func_path, str):
        raise ValueError("Function path must be a non-empty string.")

    if "." not in func_path:
        raise ValueError(
            f"Invalid function path '{func_path}'. Must be in the format 'module.submodule.function'."
        )

    try:
        # Split the fully qualified name into module and function
        module_name, func_name = func_path.rsplit(".", 1)

        logger.debug(
            f"Attempting to import module '{module_name}' for function '{func_name}'."
        )

        # Dynamically import the module
        module = importlib.import_module(module_name)

        logger.debug(f"Module '{module_name}' imported successfully.")

        # Retrieve the function or object
        imported_function = getattr(module, func_name)
        logger.info(f"Successfully imported '{func_name}' from '{module_name}'.")
        return imported_function
    except ImportError as e:
        logger.error(f"Failed to import module '{module_name}' for '{func_path}': {e}")
        raise ImportError(f"Module import failed for '{module_name}': {e}") from e
    except AttributeError as e:
        logger.error(f"Function '{func_name}' not found in module '{module_name}': {e}")
        raise AttributeError(
            f"Function '{func_name}' not found in module '{module_name}': {e}"
        ) from e
