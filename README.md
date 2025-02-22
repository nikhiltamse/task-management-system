# Task Management System

A Spring Boot microservices project for managing users and tasks.

## Architecture
- **Eureka Server**: Service discovery (port 8761).
- **Gateway Service**: API Gateway (port 8080).
- **User Service**: User registration and JWT login (port 8081).
- **Task Service**: Task CRUD with JWT security (port 8082).

## Setup
1. **Prerequisites**: Java 17, Maven, PostgreSQL.
2. **Database**:
   ```sql
   CREATE DATABASE task_management_db;
   \c task_management_db
   CREATE SCHEMA users_schema;
   CREATE SCHEMA tasks_schema;