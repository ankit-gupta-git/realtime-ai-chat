import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectWS } from './ws';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { NameInputModal } from './components/NameInputModal';
import { AIBotPlaceholder } from './components/AIBotPlaceholder';
import './styles/globals.css';

export default function App() {
    const socket = useRef(null);
    const [userName, setUserName] = useState('');
    const [showNamePopup, setShowNamePopup] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    const [typers, setTypers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.current = connectWS();

        socket.current.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
            
            socket.current.on('roomNotice', (userName) => {
                console.log(`${userName} joined to group!`);
                // Add system message for user join
                const systemMessage = {
                    id: Date.now() + Math.random(),
                    sender: 'System',
                    text: `${userName} joined the chat`,
                    ts: Date.now(),
                    isSystem: true
                };
                setMessages((prev) => [...prev, systemMessage]);
            });

            socket.current.on('chatMessage', (msg) => {
                console.log('msg', msg);
                setMessages((prev) => [...prev, msg]);
            });

            socket.current.on('typing', (userName) => {
                setTypers((prev) => {
                    const isExist = prev.find((typer) => typer === userName);
                    if (!isExist) {
                        return [...prev, userName];
                    }
                    return prev;
                });
            });

            socket.current.on('stopTyping', (userName) => {
                setTypers((prev) => prev.filter((typer) => typer !== userName));
            });
        });

        socket.current.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        return () => {
            if (socket.current) {
                socket.current.off('roomNotice');
                socket.current.off('chatMessage');
                socket.current.off('typing');
                socket.current.off('stopTyping');
                socket.current.off('connect');
                socket.current.off('disconnect');
            }
        };
    }, []);

    // Typing functionality is now handled in ChatInterface component

    const handleGetStarted = () => {
        setShowLanding(false);
        setShowNamePopup(true);
    };

    const handleNameSubmit = async (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;

        // Join room
        socket.current?.emit('joinRoom', trimmed);

        setUserName(trimmed);
        setShowNamePopup(false);
        
        // Add welcome message
        const welcomeMessage = {
            id: Date.now(),
            sender: 'System',
            text: `Welcome to the chat, ${trimmed}!`,
            ts: Date.now(),
            isSystem: true
        };
        setMessages([welcomeMessage]);
    };

    const handleSendMessage = (messageText) => {
        if (!messageText.trim()) return;

        const msg = {
            id: Date.now(),
            sender: userName,
            text: messageText,
            ts: Date.now(),
        };
        
        setMessages((m) => [...m, msg]);
        socket.current?.emit('chatMessage', msg);
    };

    const handleBackToLanding = () => {
        setShowLanding(true);
        setShowNamePopup(false);
        setUserName('');
        setMessages([]);
        setTypers([]);
    };

    return (
        <div className="min-h-screen font-inter">
            <AnimatePresence mode="wait">
                {showLanding && (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LandingPage onGetStarted={handleGetStarted} />
                    </motion.div>
                )}

                {!showLanding && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-screen flex flex-col"
                    >
                        {/* Top Navigation */}
                        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBackToLanding}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </motion.button>
                                <h1 className="text-xl font-semibold text-gray-900">Modern Chat</h1>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                                    isConnected 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        isConnected ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                    <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Chat Area */}
                        <div className="flex-1 flex flex-col lg:flex-row">
                            {/* Chat Interface */}
                            <div className="flex-1 min-h-0">
                                <ChatInterface
                                    messages={messages}
                                    userName={userName}
                                    typers={typers}
                                    onSendMessage={handleSendMessage}
                                    isConnected={isConnected}
                                    socket={socket.current}
                                />
                            </div>
                            
                            {/* Sidebar with AI Bot Placeholder - Hidden on mobile */}
                            <div className="hidden lg:block w-80 bg-white/50 backdrop-blur-sm border-l border-gray-200 p-4">
                                <AIBotPlaceholder onActivate={() => console.log('AI Bot activation coming soon!')} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Name Input Modal */}
            <NameInputModal
                isOpen={showNamePopup}
                onSubmit={handleNameSubmit}
                onClose={() => {
                    setShowNamePopup(false);
                    setShowLanding(true);
                }}
            />
        </div>
    );
}