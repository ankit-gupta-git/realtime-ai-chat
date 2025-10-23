import { io } from 'socket.io-client';

export function connectWS() {
    return io('https://realtime-ai-chat.onrender.com', {
        transports: ['websocket', 'polling'],  // Added polling as fallback
        cors: {
            origin: ["https://realtime-ai-chat-lilac.vercel.app", "http://localhost:5173"],  // Allow both production and local development
            credentials: true
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        forceNew: true
    });
}

