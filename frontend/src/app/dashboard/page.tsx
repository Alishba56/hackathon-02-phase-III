'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AnimatedSidebar } from '@/components/layout/AnimatedSidebar';
import { AnimatedHeader } from '@/components/layout/AnimatedHeader';
import { Container } from '@/components/layout/Container';

import { AnimatedTaskCard } from '@/components/task/AnimatedTaskCard';
import { AnimatedTaskFormModal } from '@/components/task/AnimatedTaskFormModal';
import { AnimatedEmptyState } from '@/components/task/AnimatedEmptyState';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api';
import { Task } from '@/types';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Skeleton } from '@/components/task/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';


export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTasks();
    }
  }, [authLoading, user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      addToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = async (newTask: Omit<Task, 'id'>) => {
    try {
      const createdTask = await apiClient.createTask(newTask);
      setTasks([createdTask, ...tasks]);
      setShowTaskForm(false);
      addToast('Task created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create task:', error);
      addToast('Failed to create task', 'error');
    }
  };

  const handleTaskEdited = async (editedTask: Task) => {
    try {
      const response = await apiClient.updateTask(editedTask.id, editedTask);
      setTasks(tasks.map(task => task.id === editedTask.id ? response : task));
      setShowTaskForm(false);
      setSelectedTask(null);
      addToast('Task updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update task:', error);
      addToast('Failed to update task', 'error');
    }
  };

  const handleTaskUpdated = async (updatedTask: Task) => {
    try {
      const response = await apiClient.updateTask(updatedTask.id, updatedTask);
      setTasks(tasks.map(task => task.id === updatedTask.id ? response : task));
      addToast('Task updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update task:', error);
      addToast('Failed to update task', 'error');
    }
  };

  const handleTaskDeleted = async (deletedTaskId: string) => {
    try {
      await apiClient.deleteTask(deletedTaskId);
      setTasks(tasks.filter(task => task.id !== deletedTaskId));
      addToast('Task deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete task:', error);
      addToast('Failed to delete task', 'error');
    }
  };

  const handleOpenEditForm = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <AnimatedSidebar isCollapsed={isSidebarCollapsed} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <AnimatedHeader
            onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          <main className="flex-1 overflow-y-auto p-4">
            <Container>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-6"
              >
                <h1 className="text-2xl font-bold">My Tasks</h1>
                <AnimatedButton
                  onClick={() => {
                    setSelectedTask(null);
                    setShowTaskForm(true);
                  }}
                >
                  Add Task
                </AnimatedButton>
              </motion.div>

              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {[...Array(3)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Skeleton className="h-24 rounded-lg" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : tasks.length === 0 ? (
                <AnimatedEmptyState onAddTask={() => setShowTaskForm(true)} />
              ) : (
                <LayoutGroup>
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <AnimatePresence>
                      {tasks.map((task) => (
                        <AnimatedTaskCard
                          key={task.id}
                          task={task}
                          onUpdate={handleTaskUpdated}
                          onDelete={handleTaskDeleted}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </LayoutGroup>
              )}
            </Container>
          </main>
        </div>

        {showTaskForm && (
          <AnimatedTaskFormModal
            isOpen={showTaskForm}
            onClose={() => {
              setShowTaskForm(false);
              setSelectedTask(null);
            }}
            onSubmit={selectedTask ? handleTaskEdited : handleTaskCreated}
            initialData={selectedTask || undefined}
            title={selectedTask ? 'Edit Task' : 'Create Task'}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}