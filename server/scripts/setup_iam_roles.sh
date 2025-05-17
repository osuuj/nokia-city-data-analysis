#!/bin/bash
# Script to validate and setup IAM roles for ECS tasks 
# to access AWS Secrets Manager and RDS

set -e
echo "Checking and setting up IAM roles for ECS tasks..."

# Set variable names
EXECUTION_ROLE_NAME="ecsTaskExecutionRole"
TASK_ROLE_NAME="ecsTaskRDSAccessRole"

# Check if task execution role exists
if aws iam get-role --role-name $EXECUTION_ROLE_NAME >/dev/null 2>&1; then
  echo "✅ Task execution role $EXECUTION_ROLE_NAME already exists"
else
  echo "Creating task execution role $EXECUTION_ROLE_NAME..."
  
  # Create trust relationship for ECS
  cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  # Create the execution role
  aws iam create-role \
    --role-name $EXECUTION_ROLE_NAME \
    --assume-role-policy-document file://trust-policy.json

  # Attach managed policies
  aws iam attach-role-policy \
    --role-name $EXECUTION_ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

  # Create policy for accessing secrets
  cat > secrets-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "kms:Decrypt"
      ],
      "Resource": "*"
    }
  ]
}
EOF

  # Create and attach secrets policy
  aws iam put-role-policy \
    --role-name $EXECUTION_ROLE_NAME \
    --policy-name SecretsAccessPolicy \
    --policy-document file://secrets-policy.json
  
  echo "✅ Created task execution role with necessary permissions"
fi

# Check if task role exists
if aws iam get-role --role-name $TASK_ROLE_NAME >/dev/null 2>&1; then
  echo "✅ Task role $TASK_ROLE_NAME already exists"
else
  echo "Creating task role $TASK_ROLE_NAME for RDS access..."

  # Create task role
  aws iam create-role \
    --role-name $TASK_ROLE_NAME \
    --assume-role-policy-document file://trust-policy.json

  # Create RDS access policy
  cat > rds-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds-db:connect"
      ],
      "Resource": "*"
    }
  ]
}
EOF

  # Attach RDS policy
  aws iam put-role-policy \
    --role-name $TASK_ROLE_NAME \
    --policy-name RDSAccessPolicy \
    --policy-document file://rds-policy.json

  echo "✅ Created task role with RDS access permissions"
fi

# Clean up
rm -f trust-policy.json secrets-policy.json rds-policy.json 2>/dev/null || true

echo "IAM roles setup complete. Make sure to use these roles in your ECS task definition:"
echo "- Task Execution Role ARN: arn:aws:iam::<YOUR_ACCOUNT_ID>:role/$EXECUTION_ROLE_NAME"
echo "- Task Role ARN: arn:aws:iam::<YOUR_ACCOUNT_ID>:role/$TASK_ROLE_NAME" 