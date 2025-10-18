'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: React.ReactNode;
  pageKey: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageKey }) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
  >
    {children}
  </motion.div>
);
