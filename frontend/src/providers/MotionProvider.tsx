'use client';

import { createContext, useContext } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

interface MotionContextType {}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LayoutGroup>
      {children}
    </LayoutGroup>
  );
}

export const useMotion = () => {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
};