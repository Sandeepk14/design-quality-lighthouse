
import React from 'react';
import { motion } from '@/components/animations/Motion';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={cn("relative", className)}
    >
      <motion.div 
        className="w-full h-full bg-watt-gold rounded-sm"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/3 bg-white"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AnimatedLogo;
