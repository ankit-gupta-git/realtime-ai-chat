import sodium from 'libsodium-wrappers';

// In-memory storage for the group key (in a real app, this would be managed more securely)
let groupKey = null;

/**
 * Generates a new random encryption key
 * @returns {Promise<Uint8Array>} A new encryption key
 */
export async function generateKey() {
    await sodium.ready;
    return sodium.crypto_secretbox_keygen();
}

/**
 * Sets the group key for encryption/decryption
 * @param {string} key - The base64 encoded key
 */
export function setGroupKey(key) {
    if (key) {
        // If key is a base64 string, decode it
        if (typeof key === 'string') {
            groupKey = sodium.from_base64(key);
        } else {
            groupKey = key;
        }
    }
}

/**
 * Gets the current group key as a base64 string
 * @returns {string} Base64 encoded group key
 */
export function getGroupKey() {
    return groupKey ? sodium.to_base64(groupKey) : null;
}

/**
 * Encrypts a message using XChaCha20-Poly1305
 * @param {string} message - The message to encrypt
 * @param {Uint8Array} key - The encryption key
 * @returns {Promise<{nonce: string, ciphertext: string}>} Encrypted message with nonce
 */
export async function encryptMessage(message, key = groupKey) {
    if (!key) {
        throw new Error('No encryption key available');
    }
    
    await sodium.ready;
    
    // Generate a random nonce
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    
    // Convert message to Uint8Array
    const messageBytes = sodium.from_string(message);
    
    // Encrypt the message
    const ciphertext = sodium.crypto_secretbox_easy(messageBytes, nonce, key);
    
    // Return base64-encoded nonce and ciphertext
    return {
        nonce: sodium.to_base64(nonce),
        ciphertext: sodium.to_base64(ciphertext)
    };
}

/**
 * Decrypts a message using XChaCha20-Poly1305
 * @param {{nonce: string, ciphertext: string}} encrypted - The encrypted message with nonce
 * @param {Uint8Array} key - The decryption key
 * @returns {Promise<string>} The decrypted message
 */
export async function decryptMessage(encrypted, key = groupKey) {
    if (!key) {
        console.error('No decryption key available');
        return '[Unable to decrypt: missing key]';
    }
    
    try {
        await sodium.ready;
        
        // Convert base64 strings back to Uint8Array
        const nonce = sodium.from_base64(encrypted.nonce);
        const ciphertext = sodium.from_base64(encrypted.ciphertext);
        
        // Decrypt the message
        const decryptedBytes = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
        
        // Convert back to string
        return sodium.to_string(decryptedBytes);
    } catch (error) {
        console.error('Decryption error:', error);
        return '[Unable to decrypt message]';
    }
}

/**
 * Generates a new group key and stores it in memory and localStorage
 * @returns {Promise<string>} The new group key as base64
 */
export async function initializeGroupKey() {
    const key = await generateKey();
    const keyString = sodium.to_base64(key);
    
    // Store in memory
    groupKey = key;
    
    // Store in localStorage (for demo purposes)
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('groupKey', keyString);
        } catch (e) {
            console.warn('Failed to store group key in localStorage:', e);
        }
    }
    
    return keyString;
}

/**
 * Loads the group key from localStorage if available
 * @returns {Promise<string|null>} The loaded key or null if not found
 */
export async function loadGroupKey() {
    if (typeof window === 'undefined') return null;
    
    try {
        const keyString = localStorage.getItem('groupKey');
        if (keyString) {
            groupKey = sodium.from_base64(keyString);
            return keyString;
        }
    } catch (e) {
        console.warn('Failed to load group key from localStorage:', e);
    }
    
    return null;
}

// Initialize sodium
sodium.ready.then(() => {
    console.log('Sodium is ready');    
});
