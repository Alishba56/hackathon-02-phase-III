'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Home, PlusCircle, Calendar, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle3D } from '@/components/ui/ThemeToggle3D';

interface SidebarProps {
  isCollapsed: boolean;
}

export function AnimatedSidebar({ isCollapsed }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      } transition-all duration-300 ease-in-out shadow-2xl`}
    >
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">TF</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent"
            >
              TaskFlow
            </motion.span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-2 mt-4">
        <ul className="space-y-1">
          {[
            { icon: Home, label: 'Dashboard', href: '/dashboard' },
            { icon: PlusCircle, label: 'Add Task', href: '#' },
            { icon: Calendar, label: 'Calendar', href: '#' },
            { icon: Settings, label: 'Settings', href: '#' },
          ].map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                variant="ghost"
                className={`w-full justify-start text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-cyan-500/20 hover:backdrop-blur-sm ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Button>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 space-y-4 border-t border-white/20">
        <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
          {!isCollapsed && 'Settings'}
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <ThemeToggle3D />
        </motion.div>
      </div>
    </motion.aside>
  );
}