// Centralized API client with JWT handling
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  public async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    // Add JWT token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',  // Include cookies in cross-origin requests
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me', {
      method: 'GET',
    });
  }

  // Task methods
  async getTasks() {
    return this.request('/api/tasks');
  }

  async createTask(taskData: { title: string; description?: string; dueDate?: string; priority?: string }) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, taskData: Partial<{ title: string; description: string; completed: boolean; dueDate?: string; priority?: string }>) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // Optimistic update helper methods
  async updateTaskOptimistic(id: string, taskData: Partial<{ title: string; description: string; completed: boolean; dueDate?: string; priority?: string }>) {
    // Send the actual request
    try {
      const result = await this.request(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });
      return result;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  async deleteTaskOptimistic(id: string) {
    // Send the actual request
    try {
      const result = await this.request(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      return result;
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }

  async createTaskOptimistic(taskData: { title: string; description?: string; dueDate?: string; priority?: string }) {
    // Send the actual request
    try {
      const result = await this.request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      return result;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  async deleteTask(id: string) {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Theme methods
  async getTheme() {
    return this.request('/api/theme');
  }

  async updateTheme(theme: string) {
    return this.request('/api/theme', {
      method: 'PUT',
      body: JSON.stringify({ theme }),
    });
  }
}

export const apiClient = new ApiClient();