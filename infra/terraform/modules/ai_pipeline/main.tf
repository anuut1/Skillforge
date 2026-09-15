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
        Type       = "Pass"
        Result     = { status = "TEXT_EXTRACTED" }
        ResultPath = "$.extraction"
        Next       = "AnalyzeWithBedrock"
      }
      AnalyzeWithBedrock = {
        Type       = "Pass"
        Result     = { status = "BEDROCK_ANALYZED" }
        ResultPath = "$.analysis"
        Next       = "PublishAnalysisCompleteEvent"
      }
      PublishAnalysisCompleteEvent = {
        Type   = "Pass"
        Result = { status = "EVENT_DISPATCHED" }
        End    = true
      }
    }
  })
}

output "sqs_resume_queue_url" { value = aws_sqs_queue.resume_queue.url }
output "sqs_resume_queue_arn" { value = aws_sqs_queue.resume_queue.arn }
output "sns_notifications_arn" { value = aws_sns_topic.notifications.arn }
output "eventbridge_bus_name" { value = aws_cloudwatch_event_bus.app_bus.name }
output "step_function_arn" { value = aws_sfn_state_machine.resume_pipeline.arn }
