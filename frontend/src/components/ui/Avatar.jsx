import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Avatar({ 
  src, 
  alt, 
  name, 
  size = 'md',
  className,
  ...props 
}) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (name) => {
    if (!name) return 'bg-gray-400';
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        'rounded-full flex items-center justify-center text-white font-semibold overflow-hidden',
        sizes[size],
        getBackgroundColor(name),
        className
      )}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt || name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </motion.div>
  );
}
