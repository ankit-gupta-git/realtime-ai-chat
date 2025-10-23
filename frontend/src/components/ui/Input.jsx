import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Input({ 
  className, 
  variant = 'default',
  size = 'md',
  error = false,
  ...props 
}) {
  const baseClasses = 'w-full border rounded-lg transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500',
    ghost: 'border-transparent bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-blue-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const errorClasses = error ? 'border-red-300 focus:border-red-500' : '';

  return (
    <motion.input
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        errorClasses,
        className
      )}
      {...props}
    />
  );
}
