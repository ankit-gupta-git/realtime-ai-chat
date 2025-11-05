import { io } from 'socket.io-client';
import { 
    initializeGroupKey, 
    loadGroupKey, 
    setGroupKey, 
    getGroupKey,
    encryptMessage,
    decryptMessage
} from './utils/encryptionService';

let socket = null;

/**
 * Initialize the WebSocket connection with encryption support
 * @returns {Object} Socket.IO client instance
 */
export function connectWS() {
    if (socket) return socket;
    
    socket = io('https://realtime-ai-chat.onrender.com', {
        transports: ['websocket', 'polling'],
        cors: {
            origin: ["https://realtime-ai-chat-lilac.vercel.app", "http://localhost:5173"],
            credentials: true
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        forceNew: true
    });
    
    // Initialize encryption when socket connects
    socket.on('connect', async () => {
        console.log('Connected to server');
        
        // Try to load existing key, or generate a new one
        const key = await loadGroupKey() || await initializeGroupKey();
        console.log('Using encryption key:', key ? '✓' : 'None');
    });
    
    return socket;
}

/**
 * Send an encrypted message
 * @param {string} event - The event name (e.g., 'chatMessage')
 * @param {any} data - The data to send (will be encrypted if it contains a 'text' field)
 * @param {Function} callback - Optional callback
 */
export async function sendEncrypted(event, data, callback) {
    if (!socket) {
        console.error('Socket not initialized');
        return;
    }
    
    try {
        // If this is a chat message with text, encrypt it
        if (data && data.text) {
            const encrypted = await encryptMessage(data.text);
            const message = {
                ...data,
                encrypted: true,
                nonce: encrypted.nonce,
                ciphertext: encrypted.ciphertext,
                // Don't send plain text in production
                text: undefined
            };
            socket.emit(event, message, callback);
        } else {
            // Non-message data or data without text field, send as is
            socket.emit(event, data, callback);
        }
    } catch (error) {
        console.error('Encryption failed:', error);
        if (callback) callback({ error: 'Failed to encrypt message' });
    }
}

/**
 * Decrypt an incoming message if it's encrypted
 * @param {Object} message - The received message
 * @returns {Promise<Object>} Decrypted message
 */
export async function handleIncomingMessage(message) {
    if (!message) return message;
    
    // If message is encrypted, decrypt it
    if (message.encrypted && message.ciphertext) {
        try {
            const decryptedText = await decryptMessage({
                nonce: message.nonce,
                ciphertext: message.ciphertext
            });
            
            return {
                ...message,
                text: decryptedText,
                // Remove encryption-related fields
                encrypted: undefined,
                nonce: undefined,
                ciphertext: undefined
            };
        } catch (error) {
            console.error('Decryption failed:', error);
            return {
                ...message,
                text: '[Encrypted message - decryption failed]',
                isError: true
            };
        }
    }
    
    // Not an encrypted message, return as is
    return message;
}

// Export socket instance for direct access if needed
export { socket };

