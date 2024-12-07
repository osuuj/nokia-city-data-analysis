"""
Utility for dynamically importing modules and functions.

This module provides a function to import a specific function or object
dynamically at runtime using its fully qualified name. It helps decouple
dependencies and enables flexible function resolution.
"""

import importlib
import logging

logger = logging.getLogger(__name__)


def import_function(func_path: str):
    """
    Dynamically import a function given its fully qualified name.
    :param func_path: Fully qualified function name (e.g., "module.submodule.function").
    :return: The imported function.
    """
    try:
        module_name, func_name = func_path.rsplit(".", 1)
        module = importlib.import_module(module_name)
        return getattr(module, func_name)
    except ImportError as e:
        logger.error(f"Module import failed for {func_path}: {e}")
        raise
    except AttributeError as e:
        logger.error(f"Function {func_name} not found in module {module_name}: {e}")
        raise
