'use client';

import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import useReducedMotion from '@/hooks/useReducedMotion';

interface EmptyStateProps {
  onAddTask: () => void;
}

export function AnimatedEmptyState({ onAddTask }: EmptyStateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{
          scale: 1,
          rotate: shouldReduceMotion ? 0 : [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: shouldReduceMotion ? 0 : Infinity,
          repeatType: 'reverse',
          delay: 0.2
        }}
        className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full flex items-center justify-center mb-4"
      >
        <ClipboardList className="h-8 w-8 text-indigo-500" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-medium text-gray-900 mb-1"
      >
        No tasks yet
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 mb-6"
      >
        Get started by creating your first task
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatedButton
          onClick={onAddTask}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all"
        >
          Add your first task
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}