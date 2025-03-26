
import React from 'react';
import { motion } from './Motion';

interface PageFadeInProps {
  children: React.ReactNode;
}

export const PageFadeIn: React.FC<PageFadeInProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default PageFadeIn;
