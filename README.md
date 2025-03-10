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
3.**Run**:

   cd eureka-server && mvn spring-boot:run
   
   cd gateway-service && mvn spring-boot:run
   
   cd user-service && mvn spring-boot:run
   
   cd task-service && mvn spring-boot:run
   
4.**Test**:

   Register: POST http://localhost:8080/users/register
   
   Login: POST http://localhost:8080/users/login
   
   Create Task: POST http://localhost:8080/tasks (with Bearer token)

   ### Features
- User registration and JWT login.
- Task CRUD (create, read, update, delete) with JWT authentication.
- React frontend with task management UI.
