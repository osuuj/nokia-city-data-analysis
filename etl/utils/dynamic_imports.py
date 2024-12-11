"""Utility for dynamically importing modules and functions.

This module provides a function to import a specific function or object
dynamically at runtime using its fully qualified name. It helps decouple
dependencies and enables flexible function resolution.
"""

import importlib
import logging
from typing import Any

logger = logging.getLogger(__name__)


def import_function(func_path: str) -> Any:
    """Dynamically import a function given its fully qualified name.

    Args:
        func_path (str): Fully qualified function name
                         (e.g., "module.submodule.function").

    Returns:
        Any: The imported function or object.

    Raises:
        ImportError: If the module cannot be imported.
        AttributeError: If the function or object is not found in the module.
        ValueError: If the func_path is improperly formatted.
    """
    if "." not in func_path:
        raise ValueError(
            f"Invalid function path '{func_path}'. Must be in the format 'module.submodule.function'."
        )

    try:
        # Split the fully qualified name into module and function
        module_name, func_name = func_path.rsplit(".", 1)
        # Dynamically import the module
        module = importlib.import_module(module_name)
        # Retrieve the function or object
        imported_function = getattr(module, func_name)
        logger.info(f"Successfully imported '{func_name}' from '{module_name}'.")
        return imported_function
    except ImportError as e:
        logger.error(f"Module import failed for '{func_path}': {e}")
        raise
    except AttributeError as e:
        logger.error(f"Function '{func_name}' not found in module '{module_name}': {e}")
        raise
