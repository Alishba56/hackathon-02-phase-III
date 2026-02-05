import { useState } from 'react';
import { Button } from '@/components/task/ui/Button';
import { Checkbox } from '@/components/task/ui/Checkbox';
import { formatDate, getPriorityColor } from '@/lib/utils';
import { Task } from '@/types';
import { apiClient } from '@/lib/api';

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    // Store original value for potential rollback
    const originalCompleted = task.completed;

    // Optimistically update the UI
    const optimisticTask = { ...task, completed: !originalCompleted };
    onUpdate(optimisticTask);

    try {
      const updatedTask = await apiClient.updateTaskOptimistic(task.id, {
        completed: !originalCompleted
      });
      // Update with the server response to ensure consistency
      onUpdate(updatedTask);
    } catch (error) {
      // Revert to original state if the update failed
      const revertedTask = { ...task, completed: originalCompleted };
      onUpdate(revertedTask);
      console.error('Failed to update task:', error);
    }
  };

  const handleSave = async () => {
    // Store original values for potential rollback
    const originalTitle = task.title;
    const originalDescription = task.description;

    try {
      setIsUpdating(true);
      // Optimistically update the task in the UI
      const optimisticTask = { ...task, title, description };
      onUpdate(optimisticTask);

      const updatedTask = await apiClient.updateTaskOptimistic(task.id, {
        title,
        description
      });
      // Update with the server response to ensure consistency
      onUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      // Revert to original state if the update failed
      const revertedTask = { ...task, title: originalTitle, description: originalDescription };
      onUpdate(revertedTask);
      console.error('Failed to update task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      // Store the task for potential rollback
      const taskToRestore = task;

      // Optimistically remove the task from the UI
      onDelete(task.id);

      try {
        await apiClient.deleteTaskOptimistic(task.id);
        // Task is successfully removed from server, so we're done
      } catch (error) {
        // Add the task back if deletion failed
        // This would require a callback from parent to add the task back
        console.error('Failed to delete task:', error);
      }
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 transition-all hover:shadow-md hover-scale">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className={`${task.completed ? 'bg-green-500' : ''}`}
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                autoFocus
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm text-muted-foreground mt-1 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3">
                {task.priority && (
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                )}

                {task.dueDate && (
                  <span className="text-xs text-muted-foreground">
                    Due: {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="flex justify-end gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}