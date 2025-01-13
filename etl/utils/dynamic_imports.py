"""Dynamic Import Utilities.

This module provides a utility function to dynamically import modules and functions
at runtime using their fully qualified names. This approach supports modular and
extensible workflows, making it particularly useful in dynamic ETL pipelines.

Key Features:
- Resolves functions or objects dynamically using their string paths.
- Facilitates decoupled and extensible pipeline components.
"""

import importlib
import logging
from typing import Any

logger = logging.getLogger(__name__)


def import_function(func_path: str) -> Any:
    """Dynamically import a function or object using its fully qualified name.

    Args:
        func_path (str): Fully qualified function path in the format
                         "module.submodule.function".

    Returns:
        Any: The dynamically imported function or object.

    Raises:
        ValueError: If `func_path` is invalid or improperly formatted.
        ImportError: If the module cannot be imported.
        AttributeError: If the specified function or object is not found in the module.
    """
    if not func_path or not isinstance(func_path, str):
        raise ValueError("Function path must be a non-empty string.")

    if "." not in func_path:
        raise ValueError(
            f"Invalid function path '{func_path}'. It must be in the format 'module.submodule.function'."
        )

    module_name = ""
    func_name = ""
    try:
        module_name, func_name = func_path.rsplit(".", 1)
        logger.debug(
            f"Attempting to import module '{module_name}' for function '{func_name}'."
        )

        module = importlib.import_module(module_name)
        logger.debug(f"Module '{module_name}' imported successfully.")

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
