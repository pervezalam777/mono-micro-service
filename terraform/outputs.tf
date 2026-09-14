# Output Values
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = "https://${module.alb.load_balancer_dns_name}"
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group name"
  value       = aws_cloudwatch_log_group.microservices.name
}

output "ecs_cluster_name" {
  description = "ECS Cluster name"
  value       = aws_ecs_cluster.microservices.name
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.ecs_tasks.id
}
