# OpenAPI Schema Guidelines

This document outlines best practices for maintaining the OpenAPI specification to prevent duplication errors and ensure clean code generation.

Our OpenAPI specification generates **FastAPI/Pydantic models** in `backend/src/app/generated/` and is designed to work with **Firebase Authentication** and **Orval** for frontend TypeScript types.

## 🎯 Core Principles

### 1. **One Schema Per File**
- Each `.yml` file in `components/schemas/` should define exactly one reusable schema
- Use kebab-case naming for file names (e.g., `blog-post-summary.yml`)
- Use PascalCase for schema references in `openapi/spec/openapi.yml` (e.g., `BlogPostSummary`)
- Generated Python models use snake_case for field names (e.g., `published_at` from `publishedAt`)

### 2. **No Inline Schemas**
- ❌ **Don't** define schemas inline within other schemas
- ✅ **Do** extract reusable components to separate files and use `$ref`

```yaml
# ❌ Bad: Inline schema
properties:
  pagination:
    type: object
    properties:
      page:
        type: integer

# ✅ Good: Reference to external schema
properties:
  pagination:
    $ref: "./pagination.yml"
```

### 3. **Consistent Reference Patterns**
- **Within openapi.yml**: Use relative paths to schema files: `$ref: "./components/schemas/filename.yml"`
- **Within external files**: Use relative paths back to openapi.yml: `$ref: "../../openapi.yml#/components/schemas/SchemaName"`
- **Component references**: Always use `#/components/schemas/PascalCaseName` format for internal references
- Use descriptive names that match the schema purpose
- Group related schemas logically in the main `openapi/spec/openapi.yml`

### 4. **Path Organization Patterns**
- **Separate by feature**: Group related endpoints in dedicated path files (e.g., `paths/user-management.yml`)
- **Reference in main spec**: Use JSON pointer references in main `openapi.yml` paths section
- **Feature-based naming**: Use descriptive names that match business domains
- **Consistent structure**: Each path file contains related endpoints with full method definitions

## 📁 File Organization

```
docs/api/
├── openapi.yml                    # Main OpenAPI specification
├── openapi.bundled.yml           # Bundled version (generated)
├── paths/                         # Path definitions organized by feature
│   ├── feature-a.yml              # Endpoints for feature A
│   ├── feature-b.yml              # Endpoints for feature B
│   ├── feature-c.yml              # Endpoints for feature C
│   └── authentication.yml        # Authentication and user management
├── components/
│   ├── schemas/                   # Data models and request/response schemas
│   │   # Core data models
│   │   ├── entity-a.yml           # Primary entity
│   │   ├── entity-b.yml           # Secondary entity
│   │   ├── user-profile.yml       # User entity
│   │   
│   │   # Request/Response wrappers
│   │   ├── entity-response.yml    # Wraps single entity with status
│   │   ├── entity-list-response.yml # Wraps entity list with pagination
│   │   ├── auth-response.yml      # Authentication operation responses
│   │   ├── error-response.yml     # Error response wrapper
│   │   
│   │   # Common reusable components
│   │   ├── api-response-status.yml # Enum: [success, error]
│   │   ├── pagination.yml         # Page metadata (page, limit, total, hasNext)
│   │   ├── error-detail.yml       # Error details structure
│   │   
│   │   # Request models
│   │   ├── create-entity-request.yml # Entity creation payload
│   │   ├── update-entity-request.yml # Entity update payload
│   │   ├── login-request.yml       # Authentication requests
│   │   └── signup-request.yml      # User registration requests
│   │
│   ├── examples/                  # Example data
│   │   ├── entity-a.yml
│   │   ├── entity-b.yml
│   │   └── user-profile.yml
│   ├── parameters/                # Reusable parameters
│   │   ├── page-param.yml
│   │   ├── limit-param.yml
│   │   └── id-param.yml
│   └── responses/                 # Common response definitions
│       ├── unauthorized.yml
│       ├── forbidden.yml
│       ├── not-found.yml
│       └── validation-error.yml
└── README.md                     # API documentation
```

### Path File Organization

#### **Separate Paths by Feature Domain**
```yaml
# ✅ Good: Feature-based organization
paths/
├── authentication.yml        # Login, logout, signup, session management
├── user-management.yml       # Profile, settings, account operations  
├── content-management.yml    # CRUD operations for main content
├── admin-operations.yml      # Administrative functions
└── public-api.yml           # Public endpoints (no auth required)
```

#### **Reference Paths in Main Spec**
```yaml
# openapi.yml
paths:
  # Authentication endpoints
  /auth/login:
    $ref: './paths/authentication.yml#/~1auth~1login'
  /auth/logout:
    $ref: './paths/authentication.yml#/~1auth~1logout'
    
  # User management endpoints
  /me/profile:
    $ref: './paths/user-management.yml#/~1me~1profile'
  /me/settings:
    $ref: './paths/user-management.yml#/~1me~1settings'
```

#### **Path File Structure**
```yaml
# paths/feature.yml
/endpoint/path:
  get:
    summary: Brief description
    description: Detailed description with behavior notes
    operationId: uniqueOperationName
    tags:
      - Feature Group
    security:
      - AuthMethod: []
    parameters:
      - name: param
        in: path/query
        required: true/false
        schema:
          type: string
    responses:
      '200':
        description: Success response
        content:
          application/json:
            schema:
              $ref: "../openapi.yml#/components/schemas/ResponseSchema"
  
  post:
    # Additional methods for the same path
    
/endpoint/path/{id}:
  # Related endpoints with parameters
```

#### **Path Reference Patterns**
- **JSON Pointer encoding**: Use `~1` to escape `/` in path names
- **Relative references**: Path files reference main spec schemas
- **Consistent naming**: Match file names to feature domains
- **Complete definitions**: Each path file contains full endpoint definitions

## 🔍 Required Fields Guidelines

### Always Specify Required Fields
```yaml
type: object
properties:
  id:
    type: string
    description: Unique identifier
    example: "post-123"
  name:
    type: string
    description: Display name
    example: "My Blog Post"
required:  # ✅ Always include this
  - id
  - name
```

### Include Descriptions and Examples
Every field must have:
- **description**: Clear explanation of the field's purpose
- **example**: Realistic sample value
- **format**: For dates, use `format: date-time`
- **enum**: For restricted values (e.g., `[draft, published]`)

### Common Patterns
- **Core entities**: Include all essential identifying fields (id, title, author, etc.)
- **Request models**: Include only fields that must be provided (no auto-generated fields like id, publishedAt)
- **Response models**: Include fields that are always returned
- **Wrapper patterns**: Use consistent response structure with `status` + `data` or `status` + `error`
- **camelCase in JSON**: Use camelCase for property names (e.g., `publishedAt`, `hasNext`)
- **Enum validation**: Always specify allowed values for status fields

## 🚫 Anti-Patterns to Avoid

### 1. **Duplicate Schema Names**
```yaml
# ❌ Don't have both of these:
schemas:
  BlogPost:
    $ref: './blog-post.yml'
  blog-post:  # This creates a duplicate!
    type: object
    properties: ...
```

### 2. **Mixing Naming Conventions**
```yaml
# ❌ Inconsistent naming
schemas:
  BlogPost:      # PascalCase
    $ref: './blog-post.yml'
  comment_data:  # snake_case - don't mix!
    $ref: './comment-data.yml'
```

### 3. **Overly Nested Inline Definitions**
```yaml
# ❌ Too much nesting
properties:
  data:
    type: object
    properties:
      posts:
        type: array
        items:
          type: object  # Extract this!
          properties:
            id:
              type: string

# ✅ Good: Use references
properties:
  data:
    $ref: "./blog-post-list-data.yml"
```

### 4. **Inconsistent Response Patterns**
```yaml
# ❌ Don't mix response structures
successResponse:
  properties:
    data:
      $ref: "./blog-post.yml"

errorResponse:
  properties:
    message:  # Inconsistent with success pattern
      type: string

# ✅ Good: Consistent structure
both_responses:
  properties:
    status:
      $ref: "./api-response-status.yml"  # Always include status
    data:  # or error field
      $ref: "./blog-post.yml"
```

## 🔧 Validation Workflow

### Before Committing Changes:

1. **Validate and bundle the OpenAPI specification:**
   ```bash
   # Validate the OpenAPI structure
   pnpm api:lint
   
   # Bundle with unused component removal (prevents duplication)
   pnpm api:bundle
   
   # Generate frontend types to test Orval integration
   pnpm api:fe
   
   # View the documentation to verify
   pnpm api:docs:api
   ```

2. **Test with your backend implementation:**
   ```bash
   # Run backend tests to ensure generated models work
   cd backend
   uv run --active pytest ../tests/backend -q
   
   # Start the backend to test API endpoints
   uv run --active uvicorn app.main:app --reload --port 8000
   ```

3. **Quick validation check:**
   ```bash
   # One-liner to validate, bundle, and generate types
   pnpm api:lint && pnpm api:bundle && pnpm api:fe
   ```

### Validation Workflow

Manual validation ensures:
- ✅ **OpenAPI validity**: `pnpm api:lint` validates structure and references using Redocly
- ✅ **Path references**: All path file references resolve correctly using JSON pointer syntax
- ✅ **Bundling success**: All `$ref` references resolve correctly with `--remove-unused-components`
- ✅ **No schema duplication**: Bundled spec has unique PascalCase schema keys only
- ✅ **Path organization**: Related endpoints are logically grouped in feature-based files
- ✅ **Frontend compatibility**: Orval generates clean TypeScript types without errors
- ✅ **MSW integration**: Mock data uses example values (no faker dependency)
- ✅ **Documentation quality**: ReDoc can render the specification properly
- ✅ **Backend compatibility**: Generated FastAPI models work with your implementation

**Generated outputs to verify:**
- **Frontend types**: `frontend/src/lib/api/generated/schemas/` (PascalCase TypeScript interfaces)
- **MSW mocks**: `frontend/src/lib/api/generated/client.msw.ts` (using OpenAPI examples)
- **React Query hooks**: `frontend/src/lib/api/generated/client.ts` (typed API functions)
- **Bundled spec**: `openapi/dist/openapi.yml` (resolved references, no duplicates)
- **FastAPI models**: `backend/src/app/generated/src/generated_fastapi_server/models/`
- **API documentation**: ReDoc-compatible bundled specification

## 📝 Schema Evolution

### Adding New Schemas
1. **Create the schema file** in `components/schemas/` using kebab-case naming
2. **Add reference** in main `openapi/spec/openapi.yml` under appropriate section (use PascalCase)
3. **Create examples** in `components/examples/` with same base name
4. **Validate the changes** using redocly commands
5. **Test backend integration** to verify Pydantic model creation

**Example workflow:**
```bash
# 1. Create schema with proper structure
cat > components/schemas/new-entity.yml << 'EOF'
type: object
properties:
  id:
    type: string
    description: Unique identifier
    example: "entity-123"
  name:
    type: string
    description: Display name
    example: "My Entity"
required:
  - id
  - name
EOF

# 2. Add to openapi/spec/openapi.yml schemas section
# NewEntity:
#   $ref: './components/schemas/new-entity.yml'

# 3. Create example
cat > components/examples/new-entity.yml << 'EOF'
value:
  id: "entity-123"
  name: "Example Entity"
EOF

# 4. Validate
pnpm api:lint
```

### Modifying Existing Schemas
1. Never change existing field names (breaking change)
2. Add new optional fields as needed
3. Mark new required fields carefully
4. Update related examples and documentation

### Removing Schemas
1. Check all references before removal
2. Ensure no external consumers depend on it
3. Remove from main `openapi/spec/openapi.yml` references
4. Archive or delete the file

## 🎉 Success Criteria

A well-maintained schema structure should:
- ✅ Bundle without errors using `pnpm api:bundle` (with `--remove-unused-components`)
- ✅ Generate clean Pydantic models in `backend/src/app/generated/`
- ✅ Generate clean TypeScript types via Orval in `frontend/src/lib/api/generated/`
- ✅ Generate MSW mocks using OpenAPI examples (no faker dependency)
- ✅ Have no duplicate schema names across all components
- ✅ Use consistent naming patterns (kebab-case files, PascalCase references, camelCase properties)
- ✅ Have proper required field specifications with descriptions and examples
- ✅ Follow consistent response wrapper patterns (`status` + `data`/`error`)
- ✅ Pass validation with `pnpm api:lint`
- ✅ Use proper reference patterns (relative paths from external files to openapi.yml)
- ✅ Be compatible with Firebase Authentication integration
- ✅ Be easy to understand and maintain for the development team

## 🚨 Common Issues and Solutions

### Schema Duplication Errors
**Problem**: Orval reports "Duplicate schema names detected"
**Solution**: Follow the [schema-fix.md](./schema-fix.md) playbook:
1. Ensure PascalCase schema keys in `openapi/spec/openapi.yml` 
2. Use proper relative references from external files
3. Bundle with `--remove-unused-components` flag
4. Verify no duplicate schema definitions exist

### Faker Dependency in MSW Mocks
**Problem**: Generated MSW file imports `@faker-js/faker`
**Solution**: Configure Orval properly:
```typescript
// orval.config.ts
mock: {
  type: "msw",
  useExamples: true,
  generateEachHttpStatus: false, // Prevents faker usage for error responses
}
```

### Reference Resolution Errors
**Problem**: Bundling fails with "Can't resolve $ref"
**Solution**: Check reference patterns:
- From `openapi/spec/openapi.yml`: `$ref: "./components/schemas/filename.yml"`
- From external files: `$ref: "../../openapi.yml#/components/schemas/SchemaName"`