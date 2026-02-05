'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import useReducedMotion from '@/hooks/useReducedMotion';
import { Moon, Sun, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function EnhancedHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only redirect if user is already authenticated
    // This allows unauthenticated users to see the homepage and click buttons
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Experience blazing fast task management with smooth animations"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Simple & Intuitive",
      description: "Beautiful interface designed for effortless task organization"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Productivity Boost",
      description: "Maximize your efficiency with smart features and insights"
    }
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"
          animate={{
            x: shouldReduceMotion ? [0, 0] : [-20, 20, -20],
            y: shouldReduceMotion ? [0, 0] : [-20, 20, -20],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 blur-3xl"
          animate={{
            x: shouldReduceMotion ? [0, 0] : [20, -20, 20],
            y: shouldReduceMotion ? [0, 0] : [20, -20, 20],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">TF</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <AnimatedButton
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </AnimatedButton>
          </motion.div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Manage Tasks
              </span>
              <br />
              <span className="text-gray-800">Effortlessly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Transform your productivity with our beautifully animated task management platform.
              Designed for speed, simplicity, and maximum efficiency.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <AnimatedButton
                onClick={() => router.push('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </AnimatedButton>
              <AnimatedButton
                onClick={() => router.push('/login')}
                variant="outline"
                className="px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-300 hover:border-indigo-400 transition-all duration-300"
              >
                Sign In
              </AnimatedButton>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-indigo-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-24 text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">5M+</div>
                <div className="text-gray-600">Tasks Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-600 mb-2">99%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-500">
          <p>© 2026 TaskFlow. Made with ❤️ for productivity.</p>
        </footer>
      </div>
    </div>
  );
}