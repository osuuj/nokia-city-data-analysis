import logging
import importlib
from etl.config.config_loader import ENTITIES

logger = logging.getLogger(__name__)

def import_function(func_path: str):
    """
    Import a function dynamically from its fully qualified name.
    :param func_path: Fully qualified function name (e.g., "module.submodule.function").
    :return: The function object.
    """
    module_name, func_name = func_path.rsplit('.', 1)
    module = importlib.import_module(module_name)
    return getattr(module, func_name)

def get_extractor_function(entity_name: str):
    """
    Get the extractor function for a given entity from the ENTITIES configuration.
    :param entity_name: Name of the entity.
    :return: The extractor function.
    """
    func_path = None
    for entity in ENTITIES:
        if entity['name'] == entity_name:
            func_path = entity.get('extractor')
            break
    if not func_path:
        raise ValueError(f"No extractor function found for entity: {entity_name}")
    return import_function(func_path)

