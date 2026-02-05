// Global type definitions

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO string
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  applied: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface TaskDisplayState {
  viewMode: 'list' | 'card';
  sortBy: 'created' | 'due_date' | 'priority';
  filters: {
    completed: boolean;
    priority?: string[];
  };
  loading: boolean;
  optimisticUpdates: Map<string, Task>;
}

export interface LoadingState {
  isLoading: boolean;
  skeletonCount: number;
  type: 'task-list' | 'form' | 'auth' | 'page';
}

export interface FormState {
  isValid: boolean;
  isSubmitting: boolean;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
}

export interface ModalState {
  isOpen: boolean;
  type: 'task-form' | 'confirmation' | 'auth' | null;
  props: Record<string, any>;
  closeOnEscape: boolean;
  closeOnOverlayClick: boolean;
}

export interface FocusState {
  currentElement: HTMLElement | null;
  trapStack: HTMLElement[];
  reducedMotion: boolean;
}

export interface AnnouncementState {
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TasksResponse {
  tasks: Task[];
}