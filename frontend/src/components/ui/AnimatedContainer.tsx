'use client';

import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  [key: string]: any;
}

export function AnimatedContainer({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}