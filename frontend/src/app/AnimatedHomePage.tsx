'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import useReducedMotion from '@/hooks/useReducedMotion';

export default function AnimatedHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100">
        <motion.div
          animate={{
            rotate: shouldReduceMotion ? 0 : 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        >
          <span className="text-3xl font-bold text-white">TF</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          TaskFlow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-8"
        >
          Beautiful task management with delightful animations and smooth interactions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-4"
        >
          <AnimatedButton
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </AnimatedButton>
          <AnimatedButton
            onClick={() => router.push('/signup')}
            variant="outline"
            className="px-6 py-2 rounded-lg"
          >
            Sign Up
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </div>
  );
}