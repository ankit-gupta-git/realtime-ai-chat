class SignalProtocolStore {
  constructor() {
    this.store = {};
  }

  async getIdentityKeyPair() {
    return this.store.identityKey;
  }

  async getLocalRegistrationId() {
    return this.store.registrationId;
  }

  async put(key, value) {
    this.store[key] = value;
  }

  async get(key) {
    return this.store[key];
  }

  async remove(key) {
    delete this.store[key];
  }

  async isTrustedIdentity(identifier, identityKey) {
    if (identifier === null || identifier === undefined) {
      throw new Error("Tried to check identity key for undefined/null key");
    }
    if (!(identityKey instanceof ArrayBuffer)) {
      throw new Error("Expected identityKey to be an ArrayBuffer");
    }
    const trusted = await this.get('identityKey' + identifier);
    if (trusted === undefined) {
      return true;
    }
    return arrayBufferToString(identityKey) === arrayBufferToString(trusted);
  }

  async loadIdentityKey(identifier) {
    return await this.get('identityKey' + identifier);
  }

  async saveIdentity(identifier, identityKey) {
    const existing = await this.get('identityKey' + identifier);
    if (existing && arrayBufferToString(identityKey) !== arrayBufferToString(existing)) {
      this.put('identityKey' + identifier, identityKey);
      return true;
    } else if (!existing) {
      this.put('identityKey' + identifier, identityKey);
      return true;
    }
    return false;
  }
}

function arrayBufferToString(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export default SignalProtocolStore;