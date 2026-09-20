variable "environment" { type = string }
variable "kms_key_arn" { type = string }
variable "user_data_bucket_arn" { type = string }
variable "user_data_bucket_name" { type = string }

# 1. SQS Dead-Letter Queue & Main Queue for Asynchronous Resumes
resource "aws_sqs_queue" "resume_dlq" {
  name                      = "skillforge-resume-dlq-${var.environment}"
  message_retention_seconds = 1209600 # 14 days
  kms_master_key_id         = var.kms_key_arn
}

resource "aws_sqs_queue" "resume_queue" {
  name                       = "skillforge-resume-processing-${var.environment}"
  visibility_timeout_seconds = 300   # 5 minutes for Textract + Bedrock
  message_retention_seconds  = 86400 # 1 day
  kms_master_key_id          = var.kms_key_arn

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.resume_dlq.arn
    maxReceiveCount     = 3
  })
}

# 2. Amazon SNS Notification Topic
resource "aws_sns_topic" "notifications" {
  name              = "skillforge-student-alerts-${var.environment}"
  kms_master_key_id = var.kms_key_arn
}

# 3. Amazon EventBridge Custom Event Bus
resource "aws_cloudwatch_event_bus" "app_bus" {
  name = "skillforge-events-${var.environment}"
  tags = { Name = "skillforge-events" }
}

# 4. AWS Step Functions State Machine for Multi-Step AI Resume & Match Pipeline
resource "aws_iam_role" "step_functions_role" {
  name = "skillforge-step-functions-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "states.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_policy" "step_functions_policy" {
  name        = "skillforge-step-functions-policy-${var.environment}"
  description = "Policy allowing Step Functions to invoke backend processing Lambda"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "events:PutEvents"
        ]
        Resource = aws_cloudwatch_event_bus.app_bus.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "step_functions_attach" {
  role       = aws_iam_role.step_functions_role.name
  policy_arn = aws_iam_policy.step_functions_policy.arn
}

variable "lambda_backend_function_arn" {
  type    = string
  default = ""
}

resource "aws_sfn_state_machine" "resume_pipeline" {
  name     = "skillforge-resume-pipeline-${var.environment}"
  role_arn = aws_iam_role.step_functions_role.arn

  definition = jsonencode({
    Comment = "SkillForge End-to-End Resume & Placement Match Pipeline"
    StartAt = "ValidateDocument"
    States = {
      ValidateDocument = {
        Type       = "Pass"
        Result     = { status = "VALIDATED" }
        ResultPath = "$.validation"
        Next       = "ExtractTextWithTextract"
      }
      ExtractTextWithTextract = {
        Type     = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          "FunctionName" = var.lambda_backend_function_arn != "" ? var.lambda_backend_function_arn : "arn:aws:lambda:ap-south-1:982503294595:function:skillforge-api-backend-${var.environment}"
          "Payload" = {
            "task"       = "EXTRACT_TEXT"
            "s3Bucket.$" = "$.s3Bucket"
            "s3Key.$"    = "$.s3Key"
            "userId.$"   = "$.userId"
          }
        }
        ResultSelector = {
          "status"          = "TEXT_EXTRACTED"
          "extractedText.$" = "$.Payload.extractedText"
        }
        ResultPath = "$.extraction"
        Next       = "AnalyzeWithBedrock"
      }
      AnalyzeWithBedrock = {
        Type     = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          "FunctionName" = var.lambda_backend_function_arn != "" ? var.lambda_backend_function_arn : "arn:aws:lambda:ap-south-1:982503294595:function:skillforge-api-backend-${var.environment}"
          "Payload" = {
            "task"             = "ANALYZE_RESUME"
            "extractedText.$"  = "$.extraction.extractedText"
            "targetRole.$"     = "$.targetRole"
            "jobDescription.$" = "$.jobDescription"
            "userId.$"         = "$.userId"
          }
        }
        ResultSelector = {
          "status"     = "BEDROCK_ANALYZED"
          "analysis.$" = "$.Payload.analysis"
        }
        ResultPath = "$.analysis"
        Next       = "PublishAnalysisCompleteEvent"
      }
      PublishAnalysisCompleteEvent = {
        Type     = "Task"
        Resource = "arn:aws:states:::events:putEvents"
        Parameters = {
          Entries = [
            {
              Detail = {
                "userId.$"   = "$.userId"
                "status"     = "COMPLETED"
                "atsScore.$" = "$.analysis.analysis.atsScore"
              }
              DetailType   = "ResumeAnalyzed"
              EventBusName = aws_cloudwatch_event_bus.app_bus.name
              Source       = "skillforge.resume"
            }
          ]
        }
        ResultPath = "$.eventResult"
        End        = true
      }
    }
  })
}

output "sqs_resume_queue_url" { value = aws_sqs_queue.resume_queue.url }
output "sqs_resume_queue_arn" { value = aws_sqs_queue.resume_queue.arn }
output "sns_notifications_arn" { value = aws_sns_topic.notifications.arn }
output "eventbridge_bus_name" { value = aws_cloudwatch_event_bus.app_bus.name }
output "step_function_arn" { value = aws_sfn_state_machine.resume_pipeline.arn }
