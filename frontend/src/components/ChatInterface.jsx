import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, MoreVertical, Users, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { cn } from '../utils/cn';

export function ChatInterface({ 
  messages, 
  userName, 
  typers, 
  onSendMessage, 
  isConnected = true,
  socket
}) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimer = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [messageText]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    setIsTyping(e.target.value.length > 0);
    
    // Handle typing indicators
    if (e.target.value.length > 0 && socket) {
      socket.emit('typing', userName);
      clearTimeout(typingTimer.current);
      
      typingTimer.current = setTimeout(() => {
        socket.emit('stopTyping', userName);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Chat Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar name="Group" size="md" />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
              isConnected ? "bg-green-400" : "bg-red-400"
            )}>
              {isConnected ? <Wifi className="w-2 h-2 text-white" /> : <WifiOff className="w-2 h-2 text-white" />}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Group Chat</h2>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {typers.length > 0 ? (
                  <span className="text-blue-600">
                    {typers.join(', ')} {typers.length === 1 ? 'is' : 'are'} typing...
                  </span>
                ) : (
                  'Active now'
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline text-sm text-gray-500">Signed in as</span>
          <span className="text-sm font-medium text-gray-900 capitalize">{userName}</span>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isOwn={message.sender === userName}
              index={index}
            />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4"
      >
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
              rows={1}
              maxRows={4}
            />
            <Button 
              variant="ghost" 
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
            >
              <Smile className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="rounded-full p-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
