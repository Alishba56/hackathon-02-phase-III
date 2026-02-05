# ADR 0001: Backend Architecture for Todo Application

## Status
Accepted

## Date
2026-01-29

## Context
We need to develop a robust, secure backend for a Todo application that integrates seamlessly with a Next.js frontend using Better Auth for authentication. The backend must support full CRUD operations for tasks while ensuring proper user isolation and security.

## Decision
We chose the following architecture:

### Technology Stack
- **Framework**: FastAPI for its modern Python async capabilities, automatic API documentation, and strong typing
- **ORM**: SQLModel to leverage both SQLAlchemy's power and Pydantic's validation
- **Database**: Neon Serverless PostgreSQL for scalability and serverless benefits
- **Authentication**: JWT-based authentication integrating with Better Auth from the frontend
- **Containerization**: Docker for consistent deployment environments

### Key Architectural Decisions

1. **Authentication Integration**:
   - Use JWT tokens issued by Better Auth frontend
   - Verify tokens server-side using shared BETTER_AUTH_SECRET
   - Extract user_id from token payload for user isolation

2. **Data Model**:
   - Task entity with user_id foreign key for user isolation
   - Support for task metadata (title, description, completion status, due date, priority)
   - UUID primary keys for security and distributed systems compatibility

3. **API Design**:
   - RESTful endpoints following standard conventions
   - Wrapped responses matching frontend API expectations (`{"task": {...}}`, `{"tasks": [...]}`)
   - Query parameters for filtering and sorting
   - Proper HTTP status codes for all responses

4. **Security Measures**:
   - User isolation through user_id filtering on all queries
   - Authentication required for all endpoints
   - Proper error handling without information leakage

5. **Performance Optimization**:
   - Connection pooling for Neon database
   - Indexes on user_id and completion status for efficient querying
   - Efficient sorting options

## Alternatives Considered

1. **Alternative Frameworks**:
   - Django: More heavyweight with built-in auth, but less flexible for microservice architecture
   - Flask: Simpler but lacks FastAPI's automatic documentation and async support

2. **Alternative ORMs**:
   - Pure SQLAlchemy: More control but more boilerplate code
   - Tortoise ORM: Async native but newer and less mature

3. **Alternative Authentication**:
   - Custom auth system: More control but more complexity and potential security pitfalls
   - OAuth providers only: Less flexibility for direct email/password registration

## Consequences

### Positive
- Strong type safety through Pydantic integration
- Automatic API documentation via FastAPI
- Scalable architecture with proper user isolation
- Reusable authentication system that integrates with frontend
- Good performance with optimized queries

### Negative
- Additional complexity in JWT verification compared to session-based auth
- Dependency on shared secrets between frontend and backend
- Need for proper secret management in deployment

## Links
- Related to: Todo Application Phase 2
- Implementation: backend/ directory
- API Spec: specs/001-modern-frontend-ui/contracts/api.yaml