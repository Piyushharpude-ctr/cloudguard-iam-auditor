# CloudGuard – IAM Access Risk Auditor

CloudGuard is a cloud security project that analyzes IAM-style access
permissions and identifies potentially risky access using
least-privilege security rules.

## Problem Statement

Cloud environments use Identity and Access Management (IAM) to control
who can access resources and what actions they can perform.

Excessive permissions can increase security risk.

CloudGuard provides a simple rule-based system to identify risky access
combinations and provide security recommendations.

## Features

- IAM-style access record management
- Rule-based risk assessment
- HIGH, MEDIUM and LOW risk classification
- Least-privilege recommendations
- Input validation
- JSON API
- Health check endpoint
- Server-side data
- Docker support
- Automated testing
- ESLint code quality checks
- GitHub Actions CI/CD
- Cloud deployment

## Technology Stack

- Node.js
- Express.js
- HTML
- CSS
- JavaScript
- Node.js Test Runner
- ESLint
- Docker
- Git
- GitHub
- GitHub Actions
- Render

## Risk Rules

### HIGH Risk

Production environment + Delete permission.

### HIGH Risk

Intern role + Write or Delete permission.

### MEDIUM Risk

Developer role + Production environment + Write permission.

### LOW Risk

Other access combinations that pass the current rule set.

## API Endpoints

### Home

GET /

### Access API

GET /api/access

### Add Access

POST /access

## Security Scope

CloudGuard is an educational simulation of IAM access auditing.

It does not connect to real AWS, Azure or Google Cloud accounts.

The application does not request or store cloud credentials.

### Health Check

GET /health

## Current Status

The CloudGuard CI/CD pipeline automatically validates code,
builds the Docker image and triggers deployment after
successful checks.

## Running Locally

## Example API Request

```json
{
  "user": "Rahul",
  "role": "Developer",
  "environment": "Production",
  "resource": "S3",
  "permission": "Delete"
}