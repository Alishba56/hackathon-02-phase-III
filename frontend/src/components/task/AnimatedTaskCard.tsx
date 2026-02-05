'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import useReducedMotion from '@/hooks/useReducedMotion';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function AnimatedTaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.4, 0, 1, 1]
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const handleToggleComplete = () => {
    onUpdate({
      ...task,
      completed: !task.completed
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="cursor-pointer"
    >
      <Card className={`group hover:shadow-lg transition-all duration-300 ${
        task.completed ? 'opacity-70 border-green-200' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />

            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${
                task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {task.title}
              </h3>

              {task.description && (
                <p className={`text-sm mt-1 text-muted-foreground truncate ${
                  task.completed ? 'line-through' : ''
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(task.dueDate)}
                    </span>
                  )}

                  {task.priority && (
                    <Badge variant={task.priority === 'high' ? 'destructive' :
                                  task.priority === 'medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-red-500">×</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}