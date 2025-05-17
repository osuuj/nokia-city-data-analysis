#!/usr/bin/env python3
"""Patch to fix SSL settings in database.py"""

import os
import re

def patch_database_file():
    """Patch the database.py file to modify SSL settings"""
    file_path = "server/backend/database.py"
    
    # Read the file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replace the SSL configuration section
    pattern = r'# Only enable SSL in production or if explicitly set\nif settings\.ENVIRONMENT == "production" or settings\.DB_SSL_MODE == "require":\n    # Enable SSL\n    connect_args\["ssl"\] = True\n    logger\.info\("SSL enabled for database connection"\)'
    
    replacement = """# Check SSL mode setting
if settings.DB_SSL_MODE == "disable" or os.environ.get("PGSSLMODE") == "disable":
    # Explicitly disable SSL
    connect_args["ssl"] = False
    logger.info("SSL disabled for database connection")
elif settings.ENVIRONMENT == "production" or settings.DB_SSL_MODE == "require":
    # Enable SSL
    connect_args["ssl"] = True
    logger.info("SSL enabled for database connection")"""
    
    new_content = re.sub(pattern, replacement, content)
    
    # Write back to the file
    with open(file_path, 'w') as f:
        f.write(new_content)
    
    print(f"Patched {file_path} to fix SSL configuration")

if __name__ == "__main__":
    patch_database_file() 