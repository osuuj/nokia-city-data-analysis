# Server Deployment Checklist

## Pre-Deployment Preparations

- [x] Run complete test suite on production Docker image
- [x] Verify database migrations work correctly with production settings
- [x] Check that SQLAlchemy query fixes are working properly (str.label issues resolved)
- [x] Ensure caching mechanisms are configured appropriately for production
- [x] Verify service layer separation is complete and working as expected

## AWS Cloud Deployment

- [ ] Deploy to AWS ECS using the task definition in `deployment/aws-ecs-task-definition.json`
- [ ] Configure AWS Secrets Manager for database credentials
- [ ] Set up proper IAM roles and policies for the ECS task
- [ ] Verify all endpoints work correctly in the cloud environment
- [ ] Set up CloudWatch metrics and logging
- [ ] Configure proper security groups and VPC settings for database access
- [ ] Set up environment variables in ECS task definition:
  - [ ] `ENVIRONMENT=production`
  - [ ] `BACKEND_CORS_ORIGINS=https://your-vercel-app-domain.vercel.app,https://your-custom-domain.com`
  - [ ] Configure other environment variables for database, etc.
- [ ] Configure proper scaling policies based on expected load

## Client Integration

- [x] Create a client-side environment configuration for development vs production API URLs
- [ ] Update Vercel environment variables to point to the AWS API endpoint:
  - [ ] `NEXT_PUBLIC_API_BASE_URL=https://your-aws-api-gateway-url.amazonaws.com`
  - [ ] `NEXT_PUBLIC_API_VERSION=v1`
  - [ ] `NEXT_PUBLIC_ENVIRONMENT=production`
- [x] Verify the client-side API integration in the client folder works with the deployed API
- [x] Test CORS configuration with the Vercel frontend (confirm the BACKEND_CORS_ORIGINS includes Vercel domain)
- [x] Implement client-side retry and error handling for API failures
- [x] Add loading states in client UI for slower API operations

## End-to-End Validation

- [ ] Create automated integration tests for the entire flow
- [ ] Set up a CI/CD pipeline for testing both client and server together
- [ ] Establish monitoring for key API endpoints
- [ ] Set up alerts for API failures or performance issues
- [ ] Document API contracts for frontend developers
- [ ] Test geospatial data visualization with real production data

## Final Documentation

- [ ] Update the API documentation with production endpoints
- [ ] Create user documentation for using the API
- [ ] Document deployment process for future team members
- [ ] Create troubleshooting guide for common issues
- [ ] Document rollback procedures in case of deployment failures
- [ ] Create handover documentation with system architecture diagrams

## Security Audit

- [ ] Conduct a security audit of the deployed application
- [ ] Verify proper rate limiting is in place and working
- [ ] Check that all secrets are properly managed and not exposed
- [ ] Ensure database credentials are securely stored
- [ ] Test API endpoints for common vulnerabilities (SQL injection, etc.)
- [ ] Configure proper CDN/WAF for production API endpoints

## Performance Testing

- [ ] Conduct load testing on key endpoints
- [ ] Verify database indexes are working efficiently
- [ ] Check cache effectiveness for frequently accessed data
- [ ] Optimize slow queries if identified
- [ ] Test performance with realistic data volumes
- [ ] Set up performance monitoring for long-term tracking

## Future Improvements

These items from the SERVER_IMPROVEMENT_PLAN.md are deferred for future implementation:

- [ ] JWT authentication and RBAC - when user management becomes necessary
- [ ] Client SDK generation - if frontend needs tighter API integration
- [ ] X-Ray integration for better observability in production 