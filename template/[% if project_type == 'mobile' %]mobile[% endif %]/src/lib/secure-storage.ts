import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import aesjs from 'aes-js';

// Supabase sessions can exceed the 2048-byte SecureStore item limit, so the
// session ciphertext lives in AsyncStorage and only the per-key AES key lives
// in SecureStore. This is the standard supabase-js + Expo encrypted-adapter
// pattern: a fresh 256-bit key per storage key, AES-CTR over the value.

class EncryptedStore {
  private async keyName(key: string): Promise<string> {
    // SecureStore keys allow a limited charset; hash to stay safe.
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      key,
    );
    return `sb-enc-${digest}`;
  }

  private async getOrCreateAesKey(key: string): Promise<Uint8Array> {
    const name = await this.keyName(key);
    const existing = await SecureStore.getItemAsync(name);
    if (existing) {
      return aesjs.utils.hex.toBytes(existing);
    }
    const fresh = Crypto.getRandomBytes(32);
    await SecureStore.setItemAsync(name, aesjs.utils.hex.fromBytes(fresh));
    return fresh;
  }

  async getItem(key: string): Promise<string | null> {
    const cipherHex = await AsyncStorage.getItem(key);
    if (!cipherHex) {
      return null;
    }
    const aesKey = await this.getOrCreateAesKey(key);
    const cipher = new aesjs.ModeOfOperation.ctr(
      aesKey,
      new aesjs.Counter(1),
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(cipherHex));
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async setItem(key: string, value: string): Promise<void> {
    const aesKey = await this.getOrCreateAesKey(key);
    const cipher = new aesjs.ModeOfOperation.ctr(
      aesKey,
      new aesjs.Counter(1),
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
    await AsyncStorage.setItem(key, aesjs.utils.hex.fromBytes(encryptedBytes));
  }

  async removeItem(key: string): Promise<void> {
    const name = await this.keyName(key);
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(name);
  }
}

export const secureStorage = new EncryptedStore();
