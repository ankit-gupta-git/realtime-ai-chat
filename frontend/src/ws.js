import { io } from 'socket.io-client';

export function connectWS() {
    return io('https://realtime-ai-chat.onrender.com/'); // <- use HTTPS
}

