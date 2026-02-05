# Quickstart Guide: Modern & Best-in-Class Frontend UI

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Access to backend API (FastAPI server)

## Setup Instructions

### 1. Clone and Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

## Key Features Setup

### Authentication Integration
- Better Auth is configured for JWT-based authentication
- Login and signup pages are accessible at `/login` and `/signup`
- Protected routes automatically redirect unauthenticated users

### Theme Management
- Dark/light mode toggle available in the UI
- Automatically respects system preference by default
- Theme persists across sessions

### API Integration
- All API calls go through centralized `/lib/api.ts`
- JWT tokens are automatically attached to requests
- Error handling is built into the API client

## Component Structure

### Atomic Components (`/components/ui`)
- Buttons, inputs, checkboxes, modals
- Reusable UI primitives with consistent styling
- Built with Tailwind CSS utility classes

### Task Components (`/components/task`)
- Task cards/list items with animations
- Task form with validation
- Empty state components

### Layout Components (`/components/layout`)
- Responsive navigation
- Page layouts with proper spacing
- Global header/footer

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm run test

# Run accessibility audit
npm run audit:a11y
```

## Testing the UI

### Visual Testing
- Verify responsive design on mobile, tablet, and desktop
- Test dark/light mode switching
- Check all animations and micro-interactions

### Accessibility Testing
- Navigate using keyboard only
- Test with screen reader
- Verify color contrast ratios

### Performance Testing
- Check for layout shifts (CLS should be < 0.1)
- Verify loading states and skeleton screens
- Test optimistic updates functionality

## Troubleshooting

### Common Issues
- If authentication fails, verify backend API is running
- If styles don't load, check Tailwind configuration
- If dark mode doesn't work, ensure theme provider is properly wrapped

### Hot Reload
- The development server supports hot reload for immediate feedback
- Changes to components will reflect immediately in the browser