# SkillForge - AWS Security & Governance Architecture

## Principle of Least Privilege
No Lambda function, task definition, or service role is granted `AdministratorAccess`. Every service role has tightly scoped IAM actions:
- `skillforge-api-lambda-role`: Scoped to specific S3 bucket prefix operations (`s3:GetObject`, `s3:PutObject` on `resumes/*`), Bedrock invocation (`bedrock:InvokeModel`), and CloudWatch logging.
- `skillforge-step-functions-role`: Scoped to executing designated Lambda functions and publishing to EventBridge.

## Encryption & Key Management
- **At Rest**:
  - All S3 buckets (`skillforge-frontend` and `skillforge-user-data`) enforce Server-Side Encryption using AWS KMS Customer Managed Keys (CMK `alias/skillforge`).
  - Amazon RDS PostgreSQL volumes and snapshots are encrypted with KMS.
  - Amazon DynamoDB tables utilize KMS CMK customer-managed keys.
  - SQS Queues and SNS Topics use KMS encryption for messages at rest.
- **In Transit**:
  - CloudFront enforces `redirect-to-https` using TLS 1.3.
  - API Gateway accepts HTTPS only with modern TLS protocols.
  - PostgreSQL client connections enforce SSL/TLS (`sslmode=require`).

## Storage Isolation & Presigned Access
- Direct public access to S3 is blocked across the entire AWS account using S3 Block Public Access.
- Resumes and sensitive student documents are stored under partitioned user prefixes: `resumes/{userId}/{timestamp}-{filename}`.
- Uploads and downloads are authenticated and brokered strictly via temporary presigned URLs with 15-minute expirations.

## Authentication & Authorization
- Amazon Cognito User Pools enforce secure password complexities (8+ chars, lowercase, uppercase, numbers).
- Tokens are standard OAuth 2.0 / OIDC JWTs.
- Token verification occurs at both API Gateway (via Cognito Authorizer) and inside the microservice layer (via `aws-jwt-verify`).
- Role-based access control (RBAC) inspects the `cognito:groups` token claim for `instructors`, `students`, and `administrators`.

## Web Application Firewall (AWS WAF)
AWS WAF is attached to CloudFront and API Gateway:
- AWSManagedRulesCommonRuleSet (OWASP Top 10 mitigation)
- AWSManagedRulesKnownBadInputsRuleSet
- Rate-limiting rule: Maximum 2,000 requests per 5-minute window per IP to mitigate DoS without impacting genuine student traffic.

## Secrets Management & Auditing
- Database credentials, JWT secrets, and external integration tokens are stored in AWS Secrets Manager and never committed to version control.
- AWS CloudTrail records multi-region management events, API calls, and IAM modifications, storing logs in an immutable, access-controlled S3 bucket.
