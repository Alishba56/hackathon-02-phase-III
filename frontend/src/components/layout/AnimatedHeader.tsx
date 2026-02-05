'use client';

import { motion } from 'framer-motion';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import { ThemeToggle3D } from '@/components/ui/ThemeToggle3D';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function AnimatedHeader({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Logged out successfully', 'success');
    } catch (error) {
      addToast('Logout failed', 'error');
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </motion.div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name || 'User'}
            </span>
          </div>

          {/* 3D Theme Toggle */}
          <ThemeToggle3D />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              Logout
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}