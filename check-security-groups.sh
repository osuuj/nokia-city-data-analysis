#!/bin/bash

# Check if security group rule exists
ECS_SG_ID="sg-03f7646c23300e3a1"
RDS_SG_ID=$(aws rds describe-db-instances --query "DBInstances[?DBInstanceIdentifier=='osuuj-etl-db'].VpcSecurityGroups[0].VpcSecurityGroupId" --output text)

echo "RDS Security Group: $RDS_SG_ID"
echo "ECS Security Group: $ECS_SG_ID"

# Check inbound rules on RDS security group
echo "Checking if RDS security group allows inbound from ECS security group..."
aws ec2 describe-security-groups --group-ids $RDS_SG_ID \
  --query "SecurityGroups[0].IpPermissions[?FromPort==\`5432\` && ToPort==\`5432\` && contains(UserIdGroupPairs[*].GroupId, \`$ECS_SG_ID\`)]" \
  --output json

echo "If no rules are shown above, you need to add one:"
echo "aws ec2 authorize-security-group-ingress --group-id $RDS_SG_ID --protocol tcp --port 5432 --source-group $ECS_SG_ID"

# Check RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances --query "DBInstances[?DBInstanceIdentifier=='osuuj-etl-db'].Endpoint.Address" --output text)
echo "RDS endpoint: $RDS_ENDPOINT"

# Check if database exists
echo "Listing databases on RDS instance..."
PGPASSWORD=YOUR_PASSWORD psql -h $RDS_ENDPOINT -U postgres -c "\l" || echo "Cannot connect to database. Check credentials and security groups." 