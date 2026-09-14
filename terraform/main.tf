# Main Terraform Configuration for AWS Deployment
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "microservices-terraform-state"
    key            = "microservices/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "microservices-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Environment = var.environment
    Project     = "microservices"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "microservices" {
  name = "microservices-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
    Project     = "microservices"
  }
}

# Security Groups
resource "aws_security_group" "ecs_tasks" {
  name        = "microservices-ecs-tasks"
  description = "Security group for microservices ECS tasks"
  vpc_id      = module.vpc.vpc_id

  # Inbound rules
  ingress {
    description = "HTTP from ALB"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from ALB - Port 3000"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from ALB - Port 3001"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from ALB - Port 3002"
    from_port   = 3002
    to_port     = 3002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound rules
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
    Project     = "microservices"
  }
}

# ECS Task Definitions
module "task_definitions" {
  source = "./task-definitions"

  environment      = var.environment
  log_group_name   = aws_cloudwatch_log_group.microservices.name
  security_group   = aws_security_group.ecs_tasks.id
  task_role_arn    = aws_iam_role.ecs_task_role.arn
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
}

# ALB
module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 9.0"

  name = "microservices-alb"

  load_balancer_type = "application"
  vpc_id             = module.vpc.vpc_id
  security_groups    = [aws_security_group.ecs_tasks.id]
  subnets            = module.vpc.public_subnets

  http_tcp_listeners = [
    {
      port               = 80
      protocol           = "HTTP"
      target_group_index = 0
    }
  ]

  https_listeners = [
    {
      port               = 443
      protocol           = "HTTPS"
      certificate_arn    = var.ssl_certificate_arn
      target_group_index = 1
    }
  ]

  target_groups = [
    {
      name             = "auth-service"
      backend_protocol = "HTTP"
      backend_port     = 3000
      target_type      = "ip"
    },
    {
      name             = "author-service"
      backend_protocol = "HTTP"
      backend_port     = 3001
      target_type      = "ip"
    },
    {
      name             = "book-service"
      backend_protocol = "HTTP"
      backend_port     = 3002
      target_type      = "ip"
    },
  ]

  tags = {
    Environment = var.environment
    Project     = "microservices"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "microservices" {
  name              = "/ecs/microservices"
  retention_in_days = 14

  tags = {
    Environment = var.environment
    Project     = "microservices"
  }
}

# IAM Roles
resource "aws_iam_role" "ecs_task_role" {
  name = "microservices-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_policy" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "microservices-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs.amazonaws.com"
        }
      }
    ]
  })
}

# Output
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = "https://${module.alb.load_balancer_dns_name}"
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group name"
  value       = aws_cloudwatch_log_group.microservices.name
}
