'use client';

import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/task/ui/Button';
import useReducedMotion from '@/hooks/useReducedMotion';

export function AnimatedButton({ children, disabled, className, ...props }: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  const buttonVariants = {
    rest: {
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.1,
        ease: 'easeInOut'
      }
    },
    hover: {
      scale: disabled ? 1 : 1.02,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: 'easeOut'
      }
    },
    tap: {
      scale: disabled ? 1 : 0.98,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.1,
        ease: 'easeIn'
      }
    }
  };

  if (shouldReduceMotion) {
    return <Button disabled={disabled} className={className} {...props}>{children}</Button>;
  }

  return (
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}