# Todo App Backend

FastAPI backend for the Todo application with JWT authentication and SQLModel ORM.

## Features

- RESTful API endpoints for task management
- JWT-based authentication integrated with Better Auth
- User data isolation (each user can only access their own tasks)
- SQLModel ORM with Neon Serverless PostgreSQL
- Support for task filtering and sorting
- Comprehensive API documentation with Swagger UI
- Proper error handling and validation
- Optimized database queries with indexing

## API Documentation

Access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Task Management

- `GET /api/tasks` - Retrieve authenticated user's tasks
  - Query params: `status` (all/pending/completed), `sort` (created/title/due_date)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{task_id}` - Get a specific task
- `PUT /api/tasks/{task_id}` - Update a task
- `DELETE /api/tasks/{task_id}` - Delete a task
- `PATCH /api/tasks/{task_id}/complete` - Update task completion status

## Security Features

- JWT token authentication with secret key validation
- User data isolation - users can only access their own tasks
- Proper authorization checks on all endpoints
- Input validation and sanitization
- Rate limiting protection (configurable)

## Database Schema

- Tasks table with UUID primary key
- User ID foreign key for data isolation
- Indexed fields for optimized queries
- Timestamps for audit trail
- Priority field for task organization

## Setup

### Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Docker Deployment

Build and run with Docker:
```bash
docker build -t todo-backend .
docker run -p 8000:8000 todo-backend
```

### Docker Compose

Run the complete application stack:
```bash
docker-compose up --build
```

## Environment Variables

- `BETTER_AUTH_SECRET` - Secret key for JWT verification (shared with frontend)
- `BETTER_AUTH_URL` - URL of the frontend application
- `NEON_DB_URL` - Connection string for Neon Serverless PostgreSQL
- `DATABASE_URL` - Alternative database connection string (overrides Neon DB)

## Testing

### Unit Tests

Run the test suite:
```bash
pytest
```

### Integration Tests

Test the complete application flow:
```bash
pytest tests/integration/
```

### API Testing

Use the interactive documentation or tools like curl:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/tasks
```

## Performance Optimization

- Database indexes on frequently queried fields (user_id)
- Efficient query building with SQLModel
- Connection pooling for database operations
- Optimized response serialization

## Error Handling

- Standard HTTP status codes
- Consistent error response format
- Detailed error messages for debugging
- Graceful degradation for edge cases

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT