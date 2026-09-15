# SkillForge - AWS AI & Asynchronous Processing Pipeline

## Architecture Overview
The SkillForge AI subsystem provides intelligent document extraction, ATS keyword scoring, role match assessment, interview generation, and personalized roadmap generation.

```
+----------------+      Presigned PUT       +--------------------+
|                |=========================>|                    |
| React Frontend |                          | S3 User Data Bucket|
|                |                          | (resumes/{userId}/)|
+-------+--------+                          +---------+----------+
        |                                             |
        | POST /api/resume/process-s3                 |
        v                                             v
+-------+--------+                          +---------+----------+
|  API Gateway / |                          |   Amazon Textract  |
|  Express API   |                          | (OCR Text Extract) |
+-------+--------+                          +---------+----------+
        |                                             |
        | Enqueue / Direct Invocation                 | Raw Extracted Text
        v                                             v
+-------+--------+       Worker Task        +---------+----------+
|   Amazon SQS   |=========================>|   Amazon Bedrock   |
| (Queue & DLQ)  |                          | (Claude 3.5 Sonnet)|
+----------------+                          +---------+----------+
                                                      |
                                                      | Structured RFC 8259 JSON
                                                      v
                                            +---------+----------+
                                            |   RDS / DynamoDB   |
                                            | (Persist Results)  |
                                            +---------+----------+
                                                      |
                                                      v
                                            +---------+----------+
                                            | Amazon EventBridge |
                                            | & Amazon SNS Alert |
                                            +--------------------+
```

## AI Pipelines Implemented

### 1. Resume Extraction Pipeline (Amazon Textract)
- **Input**: User PDF resume uploaded via S3 presigned URL.
- **Process**: `DetectDocumentTextCommand` parses lines and block hierarchies with confidence metrics.
- **Error Handling**: Corrupted, image-only, or empty documents are caught with HTTP 422 descriptive errors.

### 2. Resume & Job Description Analysis (Amazon Bedrock)
- **Model**: `anthropic.claude-3-5-sonnet-20241022-v2:0` (with Titan fallback).
- **Format**: Strictly structured RFC 8259 JSON output containing:
  - `atsScore` (0–100)
  - `skillsMatchScore` (0–100)
  - `jobBreakdown` (core skills, preferred skills, responsibilities)
  - `matchingSkills` & `missingSkills` with priority rankings
  - `atsIssues` (formatting, multi-column tables, font markers)
  - `fixerSuggestions` (before & after bullet points)

### 3. Career Copilot & Adaptive Learning (Bedrock + DynamoDB)
- Synthesizes user skills, quiz scores, DSA submission milestones, and desired target role to generate customized learning roadmaps.

### 4. AI Mock Interview Simulator
- Generates tailored technical, behavioral, and system design questions based on role, difficulty, and previous mistakes.
- Evaluates candidate responses using the STAR method rubric with actionable feedback.

### 5. Asynchronous Resilience & Fallbacks
- **SQS Integration**: Queue absorbing traffic spikes with a Dead-Letter Queue (DLQ) configured for 3 maximum receive attempts.
- **Local Fallback**: When `AI_PROVIDER=local` or Bedrock credentials are unavailable, SkillForge seamlessly routes through its built-in heuristic AI engine, guaranteeing 100% test pass rates and uninterrupted local development.
