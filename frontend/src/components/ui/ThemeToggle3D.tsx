'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import useReducedMotion from '@/hooks/useReducedMotion';

export function ThemeToggle3D() {
  const { theme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
      whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      animate={{
        boxShadow: shouldReduceMotion
          ? undefined
          : theme === 'dark'
            ? '0 0 20px rgba(168, 85, 247, 0.4)'
            : '0 0 20px rgba(99, 102, 241, 0.4)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* 3D Effect Layer */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent"></div>

      {/* Inner Circle for depth */}
      <div className="absolute inset-1 rounded-full bg-white/10 backdrop-blur-sm"></div>

      {/* Icon with 3D effect */}
      <motion.div
        initial={false}
        animate={{ rotateY: shouldReduceMotion ? 0 : 360 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-white drop-shadow-lg" />
        ) : (
          <Sun className="h-4 w-4 text-white drop-shadow-lg" />
        )}
      </motion.div>

      {/* Reflective highlight */}
      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white/40"></div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/30"
        animate={{
          scale: shouldReduceMotion ? [1, 1] : [1, 1.3, 1],
        }}
        transition={{
          duration: 3,
          repeat: shouldReduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}