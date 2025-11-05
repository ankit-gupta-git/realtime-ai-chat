import { SignalProtocolAddress, SessionBuilder, SessionCipher, KeyHelper } from 'libsignal-protocol';
import SignalProtocolStore from './keystore';

class SignalProtocolManager {
  constructor() {
    this.store = new SignalProtocolStore();
    this.sessions = new Map();
  }

  async initializeAsync(userId) {
    const registrationId = await KeyHelper.generateRegistrationId();
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    
    await this.store.put('registrationId', registrationId);
    await this.store.put('identityKey', identityKeyPair);
    
    this.address = new SignalProtocolAddress(userId, 1);
  }

  async createSessionAsync(remoteUserId, preKey) {
    const address = new SignalProtocolAddress(remoteUserId, 1);
    const sessionBuilder = new SessionBuilder(this.store, address);
    await sessionBuilder.processPreKey(preKey);
  }

  async encryptMessageAsync(remoteUserId, message) {
    const address = new SignalProtocolAddress(remoteUserId, 1);
    if (!this.sessions.has(remoteUserId)) {
      const cipher = new SessionCipher(this.store, address);
      this.sessions.set(remoteUserId, cipher);
    }
    
    const cipher = this.sessions.get(remoteUserId);
    return await cipher.encrypt(Buffer.from(message, 'utf8'));
  }

  async decryptMessageAsync(remoteUserId, message) {
    const address = new SignalProtocolAddress(remoteUserId, 1);
    if (!this.sessions.has(remoteUserId)) {
      const cipher = new SessionCipher(this.store, address);
      this.sessions.set(remoteUserId, cipher);
    }
    
    const cipher = this.sessions.get(remoteUserId);
    const plaintext = await cipher.decryptPreKeyWhisperMessage(message, 'binary');
    return Buffer.from(plaintext).toString('utf8');
  }

  async generatePreKeyBundle() {
    const preKeyId = Math.floor(Math.random() * 10000);
    const signedPreKeyId = Math.floor(Math.random() * 10000);
    
    const preKey = await KeyHelper.generatePreKey(preKeyId);
    const signedPreKey = await KeyHelper.generateSignedPreKey(
      (await this.store.getIdentityKeyPair()),
      signedPreKeyId
    );

    return {
      identityKey: (await this.store.getIdentityKeyPair()).pubKey,
      registrationId: await this.store.getLocalRegistrationId(),
      preKey: {
        keyId: preKeyId,
        publicKey: preKey.keyPair.pubKey
      },
      signedPreKey: {
        keyId: signedPreKeyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature
      }
    };
  }
}

export default SignalProtocolManager;