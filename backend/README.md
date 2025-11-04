# Backend

## Applicable Versions

These guidelines are written for:

- **Python**: `3.13` and later
- **FastAPI**: Latest stable version with ASGI support
- **AWS Lambda Web Adapter**: For serverless deployment
- **Firebase Auth**: For authentication and authorization

The recommendations may not apply to older versions.

## Libraries & Tools

The following libraries and tools are part of our standard backend setup:

### 1. Web Framework & API
- **FastAPI** — modern, fast web framework for building APIs with Python
- **ASGI** — asynchronous server gateway interface
- **AWS Lambda Web Adapter** — serverless deployment adapter

### 2. Authentication & Security
- **Firebase Auth** — authentication with identity providers and token verification

### 3. Data Storage & AWS Services
- **DynamoDB** — NoSQL database for scalable data storage
- **S3** — object storage for media and file uploads
- **AWS SDK (boto3)** — AWS service integration

### 4. Validation & Schema Management
- **Pydantic** — data validation and settings management using Python type annotations
- **OpenAPI/Swagger** — API documentation and contract-first development

### 5. Development Tools & Environment
- **uv** — fast Python package installer and resolver for dependency management
- **Ruff** — extremely fast Python linter and formatter
- **pyproject.toml** — modern Python project configuration

### 6. Testing Framework
- **pytest** — mature full-featured Python testing tool
- **LocalStack** — local AWS cloud stack for testing

### 7. Optional Developer Experience
- **pyright/mypy** — static type checking
- **pre-commit** — git hook framework for code quality
- **task runner** — automation of common development tasks

## Architecture

Our backend follows these core architectural principles:

### OpenAPI-First Development
- Single source of truth in `openapi/` directory
- Contract-driven development with schema validation
- Code generation from OpenAPI specifications

### Clean Architecture & Hexagonal Architecture (Ports & Adapters)
- **Domain Layer**: Pure business logic, entities, and value objects
- **Application Layer**: Use cases and orchestration
- **Infrastructure Layer**: External adapters (databases, APIs, services)
- **API Layer**: Transport layer with FastAPI routers

### Layer Structure
- **`api/`** — Transport layer: FastAPI routers, request/response mappers
- **`application/`** — Use cases/services, orchestrations, ports (interfaces)
- **`domain/`** — Entities, value objects, domain services, domain events
- **`infra/`** — Adapters: DynamoDB repos, S3 gateways, outbound HTTP clients, Firebase verification
- **`shared/`** — Cross-cutting concerns: config, errors, logging, time, ULID/UUID generation

## Directory Structure

The backend directory is structured to reflect the Clean Architecture principles.

```
backend/
├── src/app/
│   ├── api/                    # API Layer: FastAPI routers, dependencies, and implementation
│   │   ├── routes/             # Route modules organized by feature
│   │   │   ├── authentication.py # Auth endpoints (/auth/login, /auth/signup, etc.)
│   │   │   ├── personal_notebook.py # Private note endpoints (/me/notes)
│   │   │   ├── public_notes.py    # Public note endpoints (/notes)
│   │   │   └── user_profile.py    # User profile endpoints (/me)
│   │   └── router.py           # Main API router that includes all feature routers
│   ├── application/            # Application Layer: Use cases and services
│   │   ├── services/           # Application services
│   │   │   ├── note_service.py
│   │   │   ├── user_service.py
│   │   │   └── auth_service.py
│   │   └── ports/              # Interfaces for repositories (abstract)
│   │       ├── note_repository.py
│   │       └── user_repository.py
│   ├── domain/                 # Domain Layer: Core business logic and entities
│   │   ├── entities/           # Domain entities
│   │   │   ├── note.py         # Note entity (can represent public or private)
│   │   │   └── user.py         # User entity (anonymous and regular)
│   │   └── services/           # Domain services with pure business logic
│   │       └── note_service.py
│   ├── infra/                  # Infrastructure Layer: Adapters and external services
│   │   ├── repositories/       # Repository implementations
│   │   │   ├── dynamodb_note_repository.py
│   │   │   └── dynamodb_user_repository.py
│   │   └── auth/               # Firebase authentication adapter
│   │       └── firebase_auth_service.py
│   ├── generated/              # 🚫 Auto-generated code from OpenAPI (DO NOT EDIT)
│   │   └── src/generated_fastapi_server/
│   │       └── models/         # Pydantic models (e.g., public_note.py, create_note_request.py)
│   ├── shared/                 # Cross-cutting concerns: config, errors, logging
│   │   ├── config.py           # Configuration management
│   │   ├── dependencies.py     # FastAPI dependencies
│   │   └── error_handlers.py   # Global error handling
│   └── main.py                 # FastAPI application entry point
├── scripts/                  # Utility scripts (e.g., data seeding)
│   └── seed_data.py
├── tests/                    # Tests
│   ├── unit/                 # Unit tests for domain and application layers
│   │   ├── domain/
│   │   └── application/
│   ├── integration/          # Integration tests for infra and api layers
│   │   ├── infra/
│   │   └── api/
│   ├── factories/            # Test data factories (e.g., note_factory.py)
│   └── conftest.py           # Pytest configuration and fixtures
├── Dockerfile                # Docker configuration for development
├── Dockerfile.lambda         # Docker configuration for AWS Lambda deployment
└── pyproject.toml            # Python project configuration
```