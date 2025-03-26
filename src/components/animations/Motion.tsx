
import React from 'react';

interface MotionProps {
  children?: React.ReactNode;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

// A simplified version of motion components for animations
export const motion = {
  div: ({ 
    children, 
    initial, 
    animate, 
    exit, 
    transition, 
    whileHover, 
    whileTap,
    className = '',
    style = {},
    ...props 
  }: MotionProps) => {
    const animationClass = 'fade-in';
    
    return (
      <div 
        className={`${className} ${animationClass}`}
        style={{
          ...style,
          animationDuration: transition?.duration ? `${transition.duration}s` : '0.5s',
          animationDelay: transition?.delay ? `${transition.delay}s` : '0s',
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
  h1: (props: MotionProps) => <motion.div as="h1" {...props} />,
  h2: (props: MotionProps) => <motion.div as="h2" {...props} />,
  h3: (props: MotionProps) => <motion.div as="h3" {...props} />,
  p: (props: MotionProps) => <motion.div as="p" {...props} />,
  span: (props: MotionProps) => <motion.div as="span" {...props} />,
  ul: (props: MotionProps) => <motion.div as="ul" {...props} />,
  li: (props: MotionProps) => <motion.div as="li" {...props} />,
  button: (props: MotionProps) => <motion.div as="button" {...props} />,
  a: (props: MotionProps) => <motion.div as="a" {...props} />,
};

export default motion;
