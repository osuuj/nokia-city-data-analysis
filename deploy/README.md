# Database SSL Fix for ECS Deployment

This directory contains scripts to fix the "Task is stopping" issue with the FastAPI container in ECS, which is failing due to SSL certificate verification problems when connecting to the RDS database.

## Files

- `build-and-push.sh`: Builds the Docker image using the SSL-patched Dockerfile and pushes it to ECR
- `update-task-definition.sh`: Updates the ECS task definition to use the new image and disable SSL
- `check-db-connection.sh`: Tests database connectivity with SSL disabled

## How to Use

1. First, verify you can connect to the database with SSL disabled:
   ```
   ./deploy/check-db-connection.sh
   ```

2. Build and push the SSL-patched Docker image:
   ```
   ./deploy/build-and-push.sh
   ```

3. Update the ECS task definition with the new image and SSL settings:
   ```
   ./deploy/update-task-definition.sh
   ```

4. Monitor the deployment in the AWS console or with AWS CLI:
   ```
   aws ecs describe-services --cluster osuuj-ecs-cluster --services nokia-city-data-api --region eu-north-1
   ```

## The Fix

The fix works by:

1. Using the SSL-patched Dockerfile (`Dockerfile.ssl-patch`) which:
   - Embeds a runtime patch for the database.py file
   - Forces SSL to be disabled with environment variables
   - Properly handles SSL settings in the entrypoint script

2. Adding environment variables in the task definition:
   - `DB_SSL_MODE=disable`
   - `PGSSLMODE=disable`

3. Pinning SQLAlchemy to version 2.0.36 to avoid version compatibility issues

## Troubleshooting

If the task still fails:

1. Check the logs in AWS CloudWatch
2. Verify security group rules allow the ECS task to connect to RDS
3. Make sure the database exists and the credentials are correct
4. Verify the database schema has been applied 