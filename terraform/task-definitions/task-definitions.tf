# ECS Task Definitions Module
locals {
  container_definitions = [
    {
      name      = "auth-service"
      image     = "${var.docker_registry}/auth-service:${var.docker_image_tag}"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "NODE_ENV", value = var.environment },
        { name = "PORT", value = "3000" },
        { name = "MONGODB_URI", value = var.mongo_uri },
        { name = "CORS_ORIGIN", value = var.cors_origin },
        { name = "ACCESS_TOKEN_SECRET", value = var.access_token_secret },
        { name = "REFRESH_TOKEN_SECRET", value = var.refresh_token_secret },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = var.log_group_name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "auth-service"
        }
      }
    },
    {
      name      = "author-service"
      image     = "${var.docker_registry}/author-service:${var.docker_image_tag}"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "NODE_ENV", value = var.environment },
        { name = "PORT", value = "3001" },
        { name = "POSTGRES_HOST", value = var.postgres_host },
        { name = "POSTGRES_PORT", value = "5432" },
        { name = "POSTGRES_USER", value = var.postgres_user },
        { name = "POSTGRES_PASSWORD", value = var.postgres_password },
        { name = "POSTGRES_DB", value = var.postgres_db },
        { name = "CORS_ORIGIN", value = var.cors_origin },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = var.log_group_name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "author-service"
        }
      }
    },
    {
      name      = "book-service"
      image     = "${var.docker_registry}/book-service:${var.docker_image_tag}"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3002
          hostPort      = 3002
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "NODE_ENV", value = var.environment },
        { name = "PORT", value = "3002" },
        { name = "POSTGRES_HOST", value = var.postgres_host },
        { name = "POSTGRES_PORT", value = "5432" },
        { name = "POSTGRES_USER", value = var.postgres_user },
        { name = "POSTGRES_PASSWORD", value = var.postgres_password },
        { name = "POSTGRES_DB", value = var.postgres_db },
        { name = "CORS_ORIGIN", value = var.cors_origin },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = var.log_group_name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "book-service"
        }
      }
    },
  ]
}

resource "aws_ecs_task_definition" "microservices" {
  family                   = "microservices-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024

  execution_role_arn = var.execution_role_arn
  task_role_arn      = var.task_role_arn

  container_definitions = jsonencode(local.container_definitions)

  tags = {
    Environment = var.environment
    Project     = "microservices"
  }
}

# ECS Service
resource "aws_ecs_service" "microservices" {
  name            = "microservices-service"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.microservices.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = local.container_definitions[0].name
    container_port   = 3000
  }

  depends_on = [
    aws_ecs_task_definition.microservices,
    var.alb,
  ]

  tags = {
    Environment = var.environment
    Project     = "microservices"
  }
}
