import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function AIBotPlaceholder({ onActivate }) {
  const features = [
    'Smart responses',
    'Context awareness', 
    'Multi-language support',
    'Learning capabilities'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar 
              name="AI Assistant" 
              size="lg"
              className="bg-gradient-to-br from-purple-500 to-blue-500"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">
              An intelligent chatbot that will help enhance your chat experience with smart responses and contextual understanding.
            </p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={onActivate}
              className="group"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function AIBotMessage({ message, isTyping = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start space-x-3 p-4"
    >
      <Avatar 
        name="AI Assistant" 
        size="sm"
        className="bg-gradient-to-br from-purple-500 to-blue-500"
      />
      
      <div className="flex-1">
        <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
          {isTyping ? (
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">AI is thinking</span>
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-1 h-1 bg-purple-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-900">
              {message}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
          <span>AI Assistant</span>
          <span>•</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </motion.div>
  );
}
