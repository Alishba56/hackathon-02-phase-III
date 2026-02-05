---
description: "Task list for Modern & Best-in-Class Frontend UI and Backend Implementation"
---

# Tasks: Full-Stack Todo Application

**Input**: Design documents from `/specs/001-modern-frontend-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/`, `frontend/public/`
- **Backend**: `backend/`
- Paths shown below follow the plan.md structure for full-stack application

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create frontend directory structure per implementation plan
- [X] T002 Initialize Next.js 16+ project with TypeScript, Tailwind CSS, and Better Auth dependencies
- [X] T003 [P] Configure ESLint, Prettier, and TypeScript settings
- [X] T004 [P] Set up Tailwind CSS with Next.js and configure base styles
- [X] T005 Create basic Next.js App Router structure with layout.tsx and page.tsx
- [X] T006 Create backend directory structure per implementation plan in backend/
- [X] T007 Install dependencies (fastapi, uvicorn, sqlmodel, python-dotenv, pyjwt) in backend/requirements.txt
- [X] T008 [P] Create Docker containerization in backend/Dockerfile
- [X] T009 [P] Create docker-compose.yml for multi-service orchestration in docker-compose.yml
- [X] T010 [P] Create .env.example with environment variables in backend/.env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Set up centralized API client in frontend/src/lib/api.ts with JWT handling
- [X] T012 [P] Configure Tailwind CSS custom theme with design tokens (colors, spacing, typography, border-radius, shadows)
- [X] T013 [P] Set up theme context/provider for dark mode support using CSS custom properties
- [X] T014 Create global types definitions in frontend/src/types/index.ts
- [X] T015 Configure Better Auth integration for frontend
- [X] T016 Set up environment configuration for API endpoints
- [X] T017 Create reusable utility functions in frontend/src/lib/utils.ts
- [X] T018 [P] Create Task model with proper relationships in backend/models.py
- [X] T019 [P] Implement db.py with engine/session dependency in backend/db.py
- [X] T020 [P] Implement JWT verification dependency in backend/auth_utils.py
- [X] T021 [P] Create authentication middleware in backend/auth_middleware.py
- [X] T022 [P] Set up database initialization on startup in backend/init_db.py
- [X] T023 [P] Configure connection pooling for Neon in backend/db.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: [US6] Secure Authentication Flow (Priority: P1)

**Goal**: Implement secure JWT-based authentication that integrates with Better Auth from the frontend.

**Independent Test**: Can be fully tested by verifying JWT token verification works correctly and routes are properly protected.

### Implementation for User Story 6

- [X] T024 [P] Create authentication context/provider in frontend/src/providers/
- [X] T025 Implement centered login form with subtle animations in frontend/src/app/(auth)/login/page.tsx
- [X] T026 Implement centered signup form with subtle animations in frontend/src/app/(auth)/signup/page.tsx
- [X] T027 Add proper form validation and error handling to auth forms
- [X] T028 Implement protected route wrapper for authenticated pages
- [X] T029 Integrate with Better Auth for secure authentication flow
- [X] T030 [US6] Implement JWT token verification in backend/auth_utils.py
- [X] T031 [US6] Create authentication middleware to protect routes in backend/auth_middleware.py
- [X] T032 [US6] Test authentication flow with valid/invalid JWTs

---

## Phase 4: [US4] Smooth Task Management Experience (Priority: P1)

**Goal**: Implement complete CRUD operations for tasks with proper validation and response handling.

**Independent Test**: Can be fully tested by performing various task operations (create, update, delete) and observing proper API responses.

### Implementation for User Story 4

- [X] T033 [P] Create skeleton UI components for task list loading in frontend/src/components/ui/
- [X] T034 Implement task list loading states with skeleton placeholders
- [X] T035 Create optimistic update mechanism for task operations
- [X] T036 Implement smooth loading states for form submissions
- [X] T037 Add optimistic completion toggle with server confirmation
- [X] T038 Implement proper error handling and rollback for failed optimistic updates
- [X] T039 [US4] Define Pydantic schemas (TaskCreate, TaskUpdate, TaskResponse) in backend/models.py
- [X] T040 [US4] Implement GET /api/tasks endpoint in backend/routes/tasks.py
- [X] T041 [US4] Implement POST /api/tasks endpoint in backend/routes/tasks.py
- [X] T042 [US4] Implement GET /api/tasks/{task_id} endpoint in backend/routes/tasks.py
- [X] T043 [US4] Implement PUT /api/tasks/{task_id} endpoint in backend/routes/tasks.py
- [X] T044 [US4] Implement DELETE /api/tasks/{task_id} endpoint in backend/routes/tasks.py
- [X] T045 [US4] Implement PATCH /api/tasks/{task_id}/complete endpoint in backend/routes/tasks.py
- [X] T046 [US4] Add user filtering to all task operations in backend/routes/tasks.py
- [X] T047 [US4] Add query parameters support (status, sort) to GET /api/tasks in backend/routes/tasks.py

---

## Phase 5: [US1] Premium Todo Experience (Priority: P1)

**Goal**: Ensure the backend API provides clean, consistent responses that support the premium frontend experience.

**Independent Test**: Can be fully tested by verifying API responses match the expected format for the frontend UI.

### Implementation for User Story 1

- [X] T048 [P] Create atomic UI components (Button, Input, Checkbox) in frontend/src/components/ui/
- [X] T049 [P] Create layout components (Header, Sidebar, Container) in frontend/src/components/layout/
- [X] T050 Create global CSS styles with consistent design tokens in frontend/src/app/globals.css
- [X] T051 Implement root layout with proper meta tags and theme provider in frontend/src/app/layout.tsx
- [X] T052 Create dashboard page structure in frontend/src/app/dashboard/page.tsx
- [X] T053 [P] Implement responsive container and grid system with proper spacing
- [X] T054 Add smooth CSS transitions and micro-interactions to UI elements
- [X] T055 Apply consistent rounded corners, shadows, and visual depth to components
- [X] T056 [US1] Format API responses to match frontend requirements in backend/routes/tasks.py
- [X] T057 [US1] Implement proper response wrappers (`{"task": {...}}`, `{"tasks": [...]}`) in backend/routes/tasks.py
- [X] T058 [US1] Add proper timestamps to all task operations in backend/models.py

---

## Phase 6: [US2] Responsive Cross-Device Access (Priority: P1)

**Goal**: Ensure the API works consistently across all device types through proper RESTful design.

**Independent Test**: Can be fully tested by accessing the API from different clients and verifying consistent behavior.

### Implementation for User Story 2

- [X] T059 [P] Implement mobile-first responsive design with Tailwind breakpoints
- [X] T060 Create responsive sidebar that collapses to hamburger menu on mobile
- [X] T061 Optimize touch targets for mobile interaction (minimum 44px)
- [X] T062 Adjust spacing and layout for tablet viewport sizes
- [X] T063 Implement desktop-optimized navigation and layout patterns
- [X] T064 Test responsive behavior across all targeted screen sizes
- [X] T065 [US2] Validate RESTful API design consistency across all endpoints in backend/routes/tasks.py
- [X] T066 [US2] Ensure proper HTTP status codes for all operations in backend/routes/tasks.py

---

## Phase 7: [US3] Dark Mode Accessibility (Priority: P2)

**Goal**: Implement dark mode support that activates automatically via system preference and allows manual toggle.

**Independent Test**: Toggle between light and dark themes and verify all UI elements switch to appropriate colors with proper contrast ratios, and verify app respects system preference by default.

### Implementation for User Story 3

- [X] T067 [P] Define dark mode color palette in Tailwind theme configuration
- [X] T068 Implement dark mode toggle component with proper ARIA labels
- [X] T069 Update all UI components to support dark mode variants
- [X] T070 Add system preference detection using prefers-color-scheme
- [X] T071 Ensure all color combinations meet WCAG AA contrast requirements
- [X] T072 Persist theme preference in localStorage

---

## Phase 8: [US5] Accessible Design (Priority: P2)

**Goal**: Implement proper accessibility standards with ARIA labels, keyboard navigation, focus states, and WCAG AA compliance.

**Independent Test**: Navigate using keyboard only and verify focus states are visible, all interactive elements are accessible, and screen readers can interpret all elements properly.

### Implementation for User Story 5

- [X] T073 [P] Add proper ARIA labels and roles to all UI components
- [X] T074 Implement keyboard navigation patterns and focus management
- [X] T075 Add visible focus states to all interactive elements
- [X] T076 Implement semantic HTML structure throughout the application
- [X] T077 Add screen reader announcements for important state changes
- [X] T078 Conduct accessibility audit and fix WCAG AA violations

---

## Phase 9: Task Management Core Features

**Goal**: Implement core task management functionality with proper UI components and backend API integration.

- [X] T079 [P] Create TaskCard and TaskListItem components in frontend/src/components/task/
- [X] T080 Implement task form modal with auto-focus in frontend/src/components/task/
- [X] T081 Create empty state component with SVG illustration in frontend/src/components/task/
- [X] T082 Implement "Add Task" button (FAB on mobile, header button on desktop)
- [X] T083 Add task completion toggle with smooth strike-through animation
- [X] T084 Implement due date badges and priority indicators in task components
- [X] T085 Create task filtering and sorting functionality
- [X] T086 Implement hover effects and interactive states for task items

---

## Phase 10: Error Handling & Validation

**Goal**: Centralize error handling and validation for all API endpoints.

- [X] T087 [P] Implement centralized HTTPException usage in backend/routes/tasks.py
- [X] T088 [P] Add comprehensive validation to all request/response models in backend/models.py
- [X] T089 [P] Implement proper error status codes (401, 403, 404, 422) in backend/routes/tasks.py
- [X] T090 [P] Add validation for required fields and constraints in backend/models.py

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T091 [P] Add Lucide icons throughout the application in frontend/src/components/ui/icons/
- [X] T092 Optimize for zero layout shift (CLS under 0.1) across all pages
- [X] T093 Implement reduced motion preferences for accessibility
- [X] T094 Add performance monitoring and loading optimizations
- [X] T095 Create proper error boundary components
- [X] T096 Implement proper loading and suspense boundaries
- [X] T097 Add proper meta tags and SEO optimization
- [X] T098 Conduct final visual review comparing to Linear, Todoist, Notion inspirations
- [X] T099 Perform final accessibility audit and performance testing
- [X] T100 [P] Enable API documentation (Swagger UI) in backend/main.py
- [X] T101 [P] Create comprehensive README for backend in backend/README.md
- [X] T102 [P] Test full integration with frontend via docker-compose
- [X] T103 [P] Verify all security requirements are met (JWT, user isolation)
- [X] T104 [P] Optimize queries with proper indexing in backend/models.py
- [X] T105 [P] Final testing of all endpoints with various scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Task Management Core Features (Phase 9)**: Depends on foundational and authentication completion
- **Error Handling (Phase 10)**: Depends on basic API routes being established
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1-US4 but should be independently testable
- **User Story 6 (P1)**: Can start after Foundational (Phase 2) - Critical dependency for task features

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority
- Each user story should be independently testable before proceeding

### Blocking Dependencies
- T006-T010 must complete before T018-T023
- T018-T023 must complete before T030-T032
- T030-T032 must complete before T040-T047

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members
- Frontend and backend tasks can be developed in parallel after foundational setup

---

## Parallel Example: User Story 4

```bash
# Launch all task management endpoints for User Story 4 together:
Backend Task: "Implement GET /api/tasks endpoint in backend/routes/tasks.py"
Backend Task: "Implement POST /api/tasks endpoint in backend/routes/tasks.py"
Backend Task: "Implement GET /api/tasks/{task_id} endpoint in backend/routes/tasks.py"
Frontend Task: "Create skeleton UI components for task list loading in frontend/src/components/ui/"
Frontend Task: "Implement task list loading states with skeleton placeholders"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 6 (Authentication)
4. Complete Phase 4: User Story 4 (Task Management)
5. **STOP and VALIDATE**: Test core functionality independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add Authentication → Test independently → Deploy/Demo
3. Add Task CRUD → Test independently → Deploy/Demo
4. Add Premium UI → Test independently → Deploy/Demo
5. Add Responsiveness → Test independently → Deploy/Demo
6. Add Dark Mode → Test independently → Deploy/Demo
7. Add Accessibility → Test independently → Deploy/Demo
8. Each addition adds value without breaking previous features

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Frontend Dev A: User Story 1 (Premium UI)
   - Frontend Dev B: User Story 2 (Responsive)
   - Backend Dev C: User Story 6 (Authentication API)
   - Backend Dev D: User Story 4 (Task CRUD API)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [US1], [US2], etc. label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Backend and frontend tasks can be developed in parallel after foundational setup