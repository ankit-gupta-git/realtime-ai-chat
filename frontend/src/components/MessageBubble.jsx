import { motion } from 'framer-motion';
import { Avatar } from '../components/ui/Avatar';
import { cn } from '../utils/cn';

export function MessageBubble({ message, isOwn, index }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        delay: index * 0.05
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn(
        'flex items-end space-x-2 max-w-[85%] sm:max-w-[70%]',
        isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'
      )}>
        {!isOwn && (
          <Avatar 
            name={message.sender} 
            size="sm" 
            className="mb-1"
          />
        )}
        
        <div className={cn(
          'relative group',
          isOwn ? 'items-end' : 'items-start'
        )}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
              'px-4 py-3 rounded-2xl shadow-sm',
              isOwn 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
                : 'bg-white text-gray-900 rounded-bl-md border border-gray-100'
            )}
          >
            <div className="break-words whitespace-pre-wrap text-sm leading-relaxed">
              {message.text}
            </div>
            
            <div className={cn(
              'flex items-center justify-between mt-2 text-xs',
              isOwn ? 'text-blue-100' : 'text-gray-500'
            )}>
              <span className="font-medium">{message.sender}</span>
              <span className="ml-2">{formatTime(message.ts)}</span>
            </div>
          </motion.div>
          
          {/* Message status indicator for own messages */}
          {isOwn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
