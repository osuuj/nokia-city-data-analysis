#!/bin/bash
# Script to check and verify that RDS security group allows connections from ECS

set -e
echo "Checking RDS security group..."

# Get the security group ID from GitHub secret or environment variable
# Replace this with your actual security group ID if running locally
RDS_SECURITY_GROUP_ID=${SECURITY_GROUP_ID:-"sg-exampleid"}
ECS_SECURITY_GROUP_ID=${ECS_SECURITY_GROUP_ID:-"sg-ecsexample"}

if [ "$RDS_SECURITY_GROUP_ID" == "sg-exampleid" ]; then
  echo "⚠️ Please set the SECURITY_GROUP_ID environment variable to your RDS security group ID"
  exit 1
fi

echo "RDS Security Group ID: $RDS_SECURITY_GROUP_ID"

# Check if security group allows inbound PostgreSQL traffic from ECS
RULE_EXISTS=$(aws ec2 describe-security-groups \
  --group-ids $RDS_SECURITY_GROUP_ID \
  --filters "Name=ip-permission.from-port,Values=5432" \
            "Name=ip-permission.to-port,Values=5432" \
            "Name=ip-permission.protocol,Values=tcp" \
            "Name=ip-permission.group-id,Values=$ECS_SECURITY_GROUP_ID" \
  --query 'SecurityGroups[*].IpPermissions[?FromPort==`5432`].UserIdGroupPairs[?GroupId==`'$ECS_SECURITY_GROUP_ID'`].GroupId' \
  --output text)

if [ -z "$RULE_EXISTS" ]; then
  echo "⚠️ No rule found allowing PostgreSQL access from ECS Security Group"
  echo "Adding rule to allow traffic from ECS to RDS..."
  
  aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $ECS_SECURITY_GROUP_ID \
    --description "Allow PostgreSQL from ECS"
    
  echo "✅ Added security group rule for ECS to RDS access"
else
  echo "✅ Security group already allows PostgreSQL access from ECS"
fi

# Check if SSL is enabled for RDS instance
# This requires the RDS instance identifier
# INSTANCE_ID="your-rds-instance-id"
# if [[ -n "$INSTANCE_ID" ]]; then
#   SSL_REQUIRED=$(aws rds describe-db-instances \
#     --db-instance-identifier $INSTANCE_ID \
#     --query 'DBInstances[0].IAMDatabaseAuthenticationEnabled' \
#     --output text)
#   
#   if [ "$SSL_REQUIRED" == "true" ]; then
#     echo "⚠️ IAM database authentication is enabled, which requires SSL connections"
#     echo "Ensure your FastAPI application is configured to use SSL when connecting to the database"
#   else
#     echo "✅ IAM database authentication is not enabled, SSL connections are optional"
#   fi
# fi

echo "Security group check complete" 