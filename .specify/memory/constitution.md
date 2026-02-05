# Hackathon Phase 2 – Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-Driven and Agentic Development
All implementation must be generated via Claude Code using Spec-Kit references; Zero manual coding allowed; Complete traceability from specifications to implementation through documented prompts.

### II. Modular Architecture Through Agents
Implementation must use modular architecture with specialized agents (Main Agent, Task Agent, Auth Agent, UI Agent) and defined skills; Each component must have clear responsibilities and interfaces.

### III. Full User Isolation and Data Ownership
All API endpoints must require valid JWT tokens and filter data by authenticated user_id; Users can only access their own tasks; Zero data leakage between users is permitted.

### IV. Strict Technology Stack Adherence
Implementation must use the locked technology stack: Next.js 16+ (App Router), FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth (JWT), Tailwind CSS; No external libraries beyond the specified stack.

### V. Stateless Authentication
Authentication must be stateless using JWT only; No session storage on backend; Better Auth configured with JWT plugin and shared BETTER_AUTH_SECRET between frontend and backend.

### VI. Monorepo Structure Compliance


All code must follow the documented monorepo structure including .spec-kit/config.yaml; Database schema must match specifications exactly with proper foreign key relationships.

## Security Requirements

All API endpoints must be properly authenticated and authorized; Database queries must be parameterized to prevent injection attacks; Secrets must be stored in environment variables, never hardcoded; Frontend must never have direct database access - all operations via protected FastAPI endpoints.

## Development Workflow

All features must be implemented exactly as defined in /specs folder; Code structure must follow guidelines in root CLAUDE.md, frontend/CLAUDE.md, and backend/CLAUDE.md; Responsive, clean UI using Tailwind CSS and Next.js App Router (server components by default); All CRUD operations must enforce task ownership.

## Governance

This constitution governs all development activities for the project; All implementations must strictly comply with these principles; Any deviation requires explicit amendment to this constitution; All code changes must be traceable to specifications via Claude Code prompts using @specs references.

**Version**: 1.0.0 | **Ratified**: 2026-01-28 | **Last Amended**: 2026-01-28
