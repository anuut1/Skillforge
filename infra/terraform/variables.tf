variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "domain_name" {
  description = "Optional custom domain name for SkillForge"
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Optional Route 53 Hosted Zone ID"
  type        = string
  default     = ""
}
