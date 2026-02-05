# Backend Implementation Plan: Todo Application

## Overview
This document outlines the implementation plan for the FastAPI backend of the Todo application, designed to work seamlessly with the Next.js frontend using Better Auth for authentication. The backend provides secure, scalable task management with proper user isolation and industry-standard practices.

## Architecture Sketch

### Folder Structure
```
backend/
├── auth_middleware.py          # Authentication middleware
├── auth_utils.py              # JWT utilities
├── db.py                      # Database configuration
├── init_db.py                 # Database initialization script
├── main.py                    # Main application entry point
├── models.py                  # Database models
├── README.md                  # Documentation
├── requirements.txt           # Dependencies
├── test_main.py               # Tests
├── Dockerfile                 # Container configuration
├── docker-compose.yml         # Multi-service orchestration
├── .env.example               # Environment variables example
├── routes/                    # API route definitions
│   └── tasks.py
├── utils/                     # Utility functions
│   ├── __init__.py
│   └── auth.py
└── middleware/                # Middleware modules (empty - may be used later)
```

### Dependency Flow
```
main.py (app) → routes/tasks.py (endpoints) → auth_middleware.py (auth) → auth_utils.py (JWT verification)
                                    ↓
                            models.py (data models) → db.py (database connection)
```

### Middleware Pipeline
1. CORS Middleware (handles cross-origin requests)
2. Authentication Middleware (verifies JWT token)
3. Request/Response Processing (FastAPI default)
4. Database Session Management (dependency injection)

## JWT Authentication Middleware Design

### Components
- **Token Extraction**: Extracts Bearer token from Authorization header
- **Verification**: Validates JWT signature using BETTER_AUTH_SECRET
- **User Extraction**: Decodes user_id from token payload
- **Dependency Injection**: Provides current_user_id via FastAPI Depends

### Flow
```
Request → HTTPBearer → Extract Token → Verify Signature → Extract Payload → Validate Expiration → Inject User ID
```

### Error Handling
- Missing token → 401 Unauthorized
- Invalid signature → 401 Unauthorized
- Expired token → 401 Unauthorized
- Malformed token → 401 Unauthorized

## SQLModel Models and Database Strategy

### Task Model
```python
class Task(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    due_date: Optional[datetime] = Field(default=None)
    priority: str = Field(default="medium", max_length=20)
    user_id: str = Field(index=True)  # For user isolation
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Database Connection Strategy
- **Engine**: Singleton engine with connection pooling
- **Sessions**: Per-request session via dependency injection
- **Pool Settings**: pool_size=5, max_overflow=10, pool_pre_ping=True, pool_recycle=300
- **Neon Compatibility**: SSL and channel binding configured

## Route Handlers Breakdown

### GET /api/tasks
- **Purpose**: Retrieve user's tasks with optional filtering
- **Query Params**:
  - `status` (all/pending/completed) - filters by completion status
  - `sort` (created/title/due_date) - sorts results
- **Response**: `{"tasks": [TaskResponse, ...]}`
- **Auth**: Requires valid JWT

### POST /api/tasks
- **Purpose**: Create new task for authenticated user
- **Request Body**: TaskCreate model
- **Response**: `{"task": TaskResponse}`
- **Auth**: Requires valid JWT

### GET /api/tasks/{task_id}
- **Purpose**: Retrieve specific task
- **Response**: `{"task": TaskResponse}`
- **Auth**: Requires valid JWT + user owns task

### PUT /api/tasks/{task_id}
- **Purpose**: Update existing task
- **Request Body**: TaskUpdate model
- **Response**: `{"task": TaskResponse}`
- **Auth**: Requires valid JWT + user owns task

### DELETE /api/tasks/{task_id}
- **Purpose**: Delete task
- **Response**: 204 No Content
- **Auth**: Requires valid JWT + user owns task

### PATCH /api/tasks/{task_id}/complete
- **Purpose**: Toggle task completion status
- **Query Param**: `completed` (true/false)
- **Response**: `{"task": TaskResponse}`
- **Auth**: Requires valid JWT + user owns task

## Error Handling and Validation Strategy

### Validation
- **Pydantic Models**: Built-in validation for request/response bodies
- **Field Constraints**: Length limits, type validation, required fields
- **UUID Validation**: Proper UUID format for task IDs

### Error Responses
- **401 Unauthorized**: Invalid/missing JWT token
- **403 Forbidden**: User doesn't own the requested resource
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation errors in request body

### Exception Handling
- **HTTPException**: Standard FastAPI exceptions with proper status codes
- **Validation Errors**: Automatic Pydantic validation with detailed messages
- **Database Errors**: Proper rollback and error propagation

## CORS and Environment Configuration

### CORS Settings
```python
allow_origins=[os.getenv("BETTER_AUTH_URL", "http://localhost:3000")]
allow_credentials=True
allow_methods=["*"]
allow_headers=["*"]
```

### Environment Variables
- **BETTER_AUTH_SECRET**: JWT signing secret (shared with frontend)
- **BETTER_AUTH_URL**: Frontend application URL
- **NEON_DB_URL**: PostgreSQL connection string with SSL settings

## Frontend Integration Points

### API Base URL
- Base: `http://localhost:8000/api/`
- All endpoints prefixed with `/api/`

### JWT Flow
1. Frontend authenticates user via Better Auth
2. Frontend receives JWT token
3. Frontend includes token in Authorization header: `Bearer {token}`
4. Backend verifies token and extracts user_id
5. Backend filters data by user_id for isolation

### Error Codes
- **200 OK**: Successful GET requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **401 Unauthorized**: Invalid/missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation errors

## Implementation Phases

### Phase 1: Foundation
- [x] Set up FastAPI project structure
- [x] Install dependencies (fastapi, uvicorn, sqlmodel, python-dotenv, pyjwt)
- [x] Configure environment loading
- [x] Basic main.py with app and CORS
- [x] Docker containerization

### Phase 2: Database Layer
- [x] Create models.py with Task model
- [x] Implement db.py with engine/session dependency
- [x] Database initialization on startup
- [x] Connection pooling for Neon

### Phase 3: Authentication Middleware
- [x] Implement JWT verification dependency
- [x] Handle token errors gracefully
- [x] Extract user_id for request context
- [x] Enforce user isolation

### Phase 4: Task Models & Routes
- [x] Define Pydantic schemas (TaskCreate, TaskUpdate, TaskResponse)
- [x] Implement CRUD route handlers
- [x] Add user filtering to all operations
- [x] Validate request/response data

### Phase 5: Specialized Routes
- [x] Implement PATCH endpoint for completion toggling
- [x] Add filtering and sorting capabilities
- [x] Optimize queries with indexes

### Phase 6: Error Handling & Validation
- [x] Centralize HTTPException usage
- [x] Implement proper status codes
- [x] Add comprehensive validation

### Phase 7: Integration & Polish
- [x] Enable API documentation (Swagger UI)
- [x] Add query parameters support
- [x] Finalize CORS configuration
- [x] Create comprehensive README

## Decisions Documented

### Dependency Injection Approach
- **Decision**: Use FastAPI Depends with reusable get_current_user dependency
- **Reason**: Cleaner code, reusable across routes, proper FastAPI patterns
- **Alternative Considered**: Manual extraction in each route handler

### Database Session Management
- **Decision**: Per-request Session via dependency injection
- **Reason**: Best practice for FastAPI + SQLModel, proper resource management
- **Alternative Considered**: Global session management

### Environment Loading
- **Decision**: python-dotenv for simplicity
- **Reason**: Matches provided .env example, simple setup
- **Alternative Considered**: pydantic-settings

### CORS Configuration
- **Decision**: Specific origin with credentials support
- **Reason**: Secure approach that works with Better Auth
- **Alternative Considered**: Wildcard origins

### JWT Library Choice
- **Decision**: pyjwt for lightweight JWT handling
- **Reason**: Widely used, sufficient for verification needs
- **Alternative Considered**: authlib

### Table Creation Strategy
- **Decision**: SQLModel create_all on startup
- **Reason**: Acceptable for hackathon, Neon handles schema management
- **Alternative Considered**: Manual migrations

### Response Model Design
- **Decision**: Separate Pydantic models for each operation type
- **Reason**: Better validation and documentation, clear API contracts
- **Implementation**: TaskCreate, TaskUpdate, TaskResponse models

## Testing Strategy

### Manual API Testing
- Use Postman/Thunder Client or curl to test all endpoints
- Test with valid/invalid JWTs to verify authentication
- Verify response formats match API specification

### User Isolation Testing
- Create tasks with different user contexts
- Confirm each user can only access their own tasks (403 on foreign task ID)
- Test cross-user access prevention

### Token Verification Testing
- Requests without token → 401
- Requests with expired/invalid signature → 401
- Valid tokens → successful access

### Database Persistence Testing
- Tasks created via POST visible in subsequent GET requests
- Updates/deletes work correctly and persist
- Data integrity maintained across operations

### Filtering Testing
- GET /api/tasks?status=completed returns only completed tasks for user
- Sorting parameters work correctly
- All query parameters function as expected

### Integration Testing
- Run frontend + backend together via docker-compose
- Perform full flow (login → create task → list → toggle → delete)
- Verify seamless communication between services

### Error Case Testing
- Missing title → 422 validation error
- Non-existent task → 404 not found
- Wrong user accessing task → 403 forbidden
- Invalid JWT → 401 unauthorized

### Neon Connection Testing
- Confirm connection succeeds with provided NEON_DB_URL
- Verify SSL and channel_binding settings work
- Test connection pooling behavior

## Success Criteria

### Security Requirements
- [x] All routes protected by JWT authentication
- [x] User data isolation enforced (403 for foreign resources)
- [x] Proper error handling without information leakage
- [x] Secure token verification using shared secret

### Functional Requirements
- [x] All 6 RESTful endpoints implemented
- [x] JWT middleware correctly verifies tokens
- [x] Database schema matches specifications
- [x] SQLModel used for all ORM operations
- [x] Query parameters supported (status, sort)
- [x] Error handling with proper HTTP status codes

### Performance Requirements
- [x] Efficient queries with indexes on user_id and completed
- [x] Connection pooling for Neon DB
- [x] Optimized database operations

### Integration Requirements
- [x] Seamless frontend integration via shared JWT secrets
- [x] Environment variables loaded correctly
- [x] Backend runs independently with uvicorn
- [x] API calls succeed with JWT headers

This implementation plan ensures a secure, robust, and perfectly integrated backend that meets every requirement in the original hackathon document.