#!/usr/bin/env python3
"""Validate the format of DATABASE_CREDENTIALS secret in AWS Secrets Manager.

This script checks that the secret contains all required fields in the correct format.
"""

import argparse
import json
import sys

import boto3
from botocore.exceptions import ClientError


def validate_secret_format(secret_name: str) -> bool:
    """Validate that a secret has the correct format for database credentials.

    Args:
        secret_name: Name of the secret to validate

    Returns:
        bool: True if valid, False if invalid
    """
    client = boto3.client("secretsmanager")

    try:
        response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        print(f"Error accessing secret: {e}")
        return False

    # Get secret string
    if "SecretString" not in response:
        print("Error: SecretString not found in response")
        return False

    try:
        secret = json.loads(response["SecretString"])
    except json.JSONDecodeError:
        print("Error: SecretString is not valid JSON")
        return False

    # Check required fields
    required_fields = ["username", "password", "host", "port"]
    missing_fields = [field for field in required_fields if field not in secret]

    if missing_fields:
        print(f"Error: Missing required fields: {', '.join(missing_fields)}")
        return False

    # Validate port is numeric
    try:
        port = int(secret["port"])
        if port <= 0 or port > 65535:
            print(f"Error: Port {port} is out of valid range (1-65535)")
            return False
    except ValueError:
        print(f"Error: Port '{secret['port']}' is not a valid number")
        return False

    # Validate host is not empty
    if not secret["host"]:
        print("Error: Host is empty")
        return False

    # Validate username and password are not empty
    if not secret["username"] or not secret["password"]:
        print("Error: Username or password is empty")
        return False

    # Success
    print(f"✅ Secret '{secret_name}' has valid format")
    print(f"  Host: {secret['host']}")
    print(f"  Port: {secret['port']}")
    print(f"  Username: {secret['username']}")
    print(f"  Password: {'*' * 8}")
    return True


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Validate format of DATABASE_CREDENTIALS secret"
    )
    parser.add_argument(
        "--secret-name",
        default="prod/fastapi/DATABASE_CREDENTIALS",
        help="Name of the secret to validate",
    )
    args = parser.parse_args()

    if validate_secret_format(args.secret_name):
        print("Secret validation successful")
        sys.exit(0)
    else:
        print("Secret validation failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
