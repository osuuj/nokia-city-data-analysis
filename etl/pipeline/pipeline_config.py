# Pipeline-specific configuration settings

# Default chunk size for splitting data during extraction or processing
DEFAULT_CHUNK_SIZE = 1000

# Logging configuration settings
LOGGING_LEVEL = 'INFO'  # Can be changed to DEBUG or ERROR based on requirements

# Directory paths for input/output data
# These could also be defined in the config, but if they are specific to the pipeline, keep them here.
INPUT_DIR = 'etl/data/raw/'
OUTPUT_DIR = 'etl/data/processed/'

# Some settings for the cleaning process
CLEANING_BATCH_SIZE = 500  # Number of records to process at a time during cleaning

# City-specific configuration settings
CITY_PROCESSING_ORDER = ['NOKIA', 'TAMPERE']  # Cities to process in this order

# Parameters for splitting data (if you have large datasets)
SPLIT_SIZE_THRESHOLD = 1000000  # Maximum number of records per split
