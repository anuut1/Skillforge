# SkillForge - AWS Cost Optimization & Budget Strategy

## Cost Model Summary
SkillForge is engineered to operate on AWS Free Tier and low-cost pay-per-request serverless architectures during development and early adoption, with predictable linear scaling under high traffic.

| Service | Architecture Choice | Free Tier / Cost Optimization Strategy |
| :--- | :--- | :--- |
| **CloudFront** | Global CDN | 1 TB data transfer out per month permanently free under AWS Free Tier. |
| **Amazon S3** | Static UI & User Data | S3 Lifecycle policies transition resumes to `STANDARD_IA` after 90 days and `GLACIER` after 365 days. |
| **Amazon Cognito** | User Pool | 50,000 monthly active users (MAUs) completely free forever under Cognito Free Tier. |
| **API Gateway** | HTTP API (v2) | 70% cheaper than REST API ($1.00/million requests vs $3.50/million). Rate limiting prevents rogue billing spikes. |
| **Compute (Lambda)** | Serverless Functions | 1,000,000 requests and 3.2 million seconds of compute time free per month. |
| **Database (DynamoDB)** | On-Demand (PAY_PER_REQUEST) | Zero idle cost when not processing requests. Free tier includes 25 GB storage and 25 RCU/WCU. |
| **Database (RDS)** | db.t4g.micro | ARM-based Graviton2 instance offers best performance per dollar. Single-AZ in dev; can be paused during inactive hours. |
| **Amazon Textract** | On-Demand OCR | 1,000 pages free per month for first 3 months. Only invoked when PDF file is uploaded. |
| **Amazon Bedrock** | Pay-per-token Claude 3.5 Sonnet | Tight prompt engineering with maximum token limits (4,096 max tokens) and low temperature (0.2). |

## AWS Budgets & Anomaly Detection
1. **Configured Budget Alert**:
   - Monthly limit: **$50.00 USD**
   - Alert threshold: Trigger notification to engineering leads at **80% ($40.00 USD)** of actual monthly spend.
2. **Billing Alarm**:
   - CloudWatch alarm on `EstimatedCharges` metric in `us-east-1` notifying SNS topic on unexpected cost spikes.
