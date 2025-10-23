import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Card({ 
  children, 
  className, 
  variant = 'default',
  hover = false,
  ...props 
}) {
  const baseClasses = 'rounded-xl transition-all duration-200';
  
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border border-gray-200 shadow-lg',
    glass: 'glass shadow-lg',
    flat: 'bg-gray-50 border border-gray-100'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        baseClasses,
        variants[variant],
        hoverClasses,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
