# SkillForge - AWS Cloud Architecture

## Overview
SkillForge is an enterprise, cloud-native, AI-driven career development and placement-readiness platform for university students and career switchers. This document details the production AWS cloud architecture.

```
                                  +------------------------------------+
                                  |            Route 53                |
                                  +-----------------+------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  |         AWS WAF v2                 |
                                  +-----------------+------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  |     Amazon CloudFront (CDN)        |
                                  +--------+------------------+--------+
                                           |                  |
                       Static Assets       |                  |  API Traffic
                                           v                  v
                          +----------------+----+     +-------+---------------+
                          | Amazon S3 (Frontend)|     | Amazon API Gateway v2 |
                          |   (Private + OAC)   |     +-------+---------------+
                          +---------------------+             |
                                                              v
+-----------------------+                         +-----------+---------------+
|  Amazon Cognito       |========================>|  AWS Lambda / ECS Fargate |
|  User Pool & Groups   | (JWT Token Verification)|   (Microservices Engine)  |
+-----------------------+                         +-----+-------------+-------+
                                                        |             |
                                  +---------------------+             +---------------------+
                                  |                                                         |
                                  v                                                         v
                    +-------------+--------------+                            +-------------+--------------+
                    |  Amazon RDS PostgreSQL     |                            |   Amazon DynamoDB          |
                    | (Relational User & Course) |                            | (Submissions, Activity,    |
                    +----------------------------+                            |  Notifications, Streaks)   |
                                                                              +----------------------------+

                                  +------------------------------------+
                                  |      AI & Processing Pipeline      |
                                  +-----------------+------------------+
                                                    |
                          +-------------------------+-------------------------+
                          |                         |                         |
                          v                         v                         v
               +----------+-----------+   +---------+----------+   +----------+-----------+
               |  Amazon S3 (User     |   |    Amazon SQS      |   |  AWS Step Functions  |
               |  Data & Resumes)     |-->| (Resume Queue/DLQ) |-->|   (Multi-Step AI     |
               | (KMS Encrypted + URL)|   +--------------------+   |      Orchestration)  |
               +----------+-----------+                            +----------+-----------+
                          |                                                   |
                          +-------------------------+-------------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  |   Amazon Textract & Bedrock AI     |
                                  |  (Claude 3.5 Sonnet / Titan Text)  |
                                  +-----------------+------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  | Amazon EventBridge & Amazon SNS    |
                                  |    (Event Bus & Notifications)     |
                                  +------------------------------------+
```

## Core AWS Services
1. **Amazon S3**:
   - `skillforge-frontend`: Houses compiled React/Vite assets; public access completely blocked; read exclusively via CloudFront OAC.
   - `skillforge-user-data`: Houses resumes (`resumes/{userId}/`), certifications, and project artifacts. Encrypted with AWS KMS CMK (`alias/skillforge`).
2. **Amazon CloudFront**: Low-latency global CDN with TLS 1.3, gzip/brotli compression, and custom error routing (403/404 -> `/index.html` HTTP 200) for client-side SPA routing.
3. **Amazon Cognito**: User Pools and App Client for student and instructor authentication, role groups (`students`, `instructors`, `administrators`), and JWT issuance.
4. **Amazon API Gateway v2**: High-throughput HTTP API with integrated Cognito JWT authorizer, rate throttling (500 burst, 200 RPS), and CORS protection.
5. **Compute (AWS Lambda & ECS Fargate)**: Modular execution functions with least-privilege IAM roles and VPC peering to databases.
6. **Amazon RDS PostgreSQL**: Strongly relational database for users, courses, lectures, quizzes, and enrollments. Multi-AZ capable with automated daily snapshots.
7. **Amazon DynamoDB**: Low-latency NoSQL persistence for high-velocity state: coding submissions, real-time notifications, daily challenges, and activity streaks.
8. **Amazon Textract**: Asynchronous and synchronous OCR PDF text extraction for uploaded resumes.
9. **Amazon Bedrock**: Foundation model inference (`anthropic.claude-3-5-sonnet`) for structured ATS resume matching, interview simulations, and career guidance.
10. **Amazon SQS & Step Functions**: Reliable asynchronous queueing with Dead-Letter Queues (DLQ) and multi-step pipeline orchestration.
11. **Amazon EventBridge & SNS**: Event-driven decoupled communication and student notifications.
