import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '', animate = true }) {
  const MotionWrapper = animate ? motion.div : 'div';

  return (
    <MotionWrapper
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={animate ? { duration: 0.4 } : undefined}
      className={`rounded-xl shadow-lg bg-white p-6 ${className}`}
    >
      {children}
    </MotionWrapper>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}
