# Data Model: Modern & Best-in-Class Frontend UI

## UI State Entities

### User Interface Theme
- **name**: theme
- **fields**:
  - mode: 'light' | 'dark' | 'system'
  - applied: boolean
- **relationships**: None
- **validation**: mode must be one of the allowed values
- **state transitions**: user can switch between light, dark, and system modes

### Authentication State
- **name**: auth
- **fields**:
  - isAuthenticated: boolean
  - user: User object | null
  - loading: boolean
  - error: string | null
- **relationships**: None
- **validation**: user object must conform to user schema when authenticated
- **state transitions**: unauthenticated → authenticating → authenticated/error, authenticated → logging out → unauthenticated

### Task Display State
- **name**: taskDisplay
- **fields**:
  - viewMode: 'list' | 'card'
  - sortBy: 'created' | 'due_date' | 'priority'
  - filters: { completed: boolean, priority?: string[] }
  - loading: boolean
  - optimisticUpdates: Map<string, Task>
- **relationships**: Related to Task entity
- **validation**: viewMode and sortBy must be valid options
- **state transitions**: idle → loading → loaded/error, with optimistic update states

### Loading States
- **name**: loading
- **fields**:
  - isLoading: boolean
  - skeletonCount: number
  - type: 'task-list' | 'form' | 'auth' | 'page'
- **relationships**: None
- **validation**: type must be one of allowed values
- **state transitions**: not loading → loading → loaded

### Form State
- **name**: form
- **fields**:
  - isValid: boolean
  - isSubmitting: boolean
  - errors: Record<string, string[]>
  - touched: Record<string, boolean>
- **relationships**: Related to entity being edited (Task, User)
- **validation**: depends on form type and requirements
- **state transitions**: pristine → dirty → valid/invalid → submitting → submitted/error

## UI Component Entities

### Button Component
- **name**: button
- **fields**:
  - variant: 'primary' | 'secondary' | 'ghost' | 'destructive'
  - size: 'sm' | 'md' | 'lg'
  - disabled: boolean
  - loading: boolean
  - icon: IconName | null
- **relationships**: None
- **validation**: variant and size must be valid options

### Task Card/List Item
- **name**: taskItem
- **fields**:
  - id: string
  - title: string
  - completed: boolean
  - dueDate: Date | null
  - priority: 'low' | 'medium' | 'high'
  - createdAt: Date
  - updatedAt: Date
  - hoverState: boolean
  - animationState: 'idle' | 'completing' | 'deleting'
- **relationships**: Belongs to User
- **validation**: title must not be empty, priority must be valid

### Modal/Dialog State
- **name**: modal
- **fields**:
  - isOpen: boolean
  - type: 'task-form' | 'confirmation' | 'auth' | null
  - props: Record<string, any>
  - closeOnEscape: boolean
  - closeOnOverlayClick: boolean
- **relationships**: None
- **validation**: type must be valid when open
- **state transitions**: closed → opening → open → closing → closed

## Accessibility Entities

### Focus Management
- **name**: focus
- **fields**:
  - currentElement: HTMLElement | null
  - trapStack: HTMLElement[]
  - reducedMotion: boolean
- **relationships**: None
- **validation**: elements in trapStack must be focusable

### Screen Reader Announcements
- **name**: announcement
- **fields**:
  - message: string
  - priority: 'polite' | 'assertive'
  - timestamp: Date
- **relationships**: None
- **validation**: message must not be empty, priority must be valid