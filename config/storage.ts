interface Storage {
  getString: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  delete: (key: string) => Promise<void>;
  getObject: (key: string) => Promise<any | null>;
  setObject: (key: string, obj: any) => Promise<void>;
  isMMKV: boolean;
}

let storage: any;
let isMMKV = false;

try {
  // MMKV (jika tersedia)
  const { MMKV } = require('react-native-mmkv');
  const mmkv = new MMKV();
  isMMKV = true;
  storage = {
    isMMKV: true,
    getString: async (key: string) => {
      try {
        return mmkv.getString(key) ?? null;
      } catch (e) {
        throw e;
      }
    },
    set: async (key: string, value: string) => {
      try {
        mmkv.set(key, value);
      } catch (e) {
        throw e;
      }
    },
    delete: async (key: string) => {
      try {
        mmkv.delete(key);
      } catch (e) {
        throw e;
      }
    },
    getObject: async (key: string) => {
      const s = await mmkv.getString(key);
      return s ? JSON.parse(s) : null;
    },
    setObject: async (key: string, obj: any) => {
      return mmkv.set(key, JSON.stringify(obj));
    },
  };
} catch (e) {
  // SecureStore fallback
  const SecureStore = require('expo-secure-store');
  storage = {
    isMMKV: false,
    getString: (key: string): Promise<string | null> => {
      return SecureStore.getItemAsync(key);
    },
    set: (key: string, value: string): Promise<void> => {
      return SecureStore.setItemAsync(key, value);
    },
    delete: (key: string): Promise<void> => {
      return SecureStore.deleteItemAsync(key);
    },
    getObject: async (key: string): Promise<any | null> => {
      const s = await SecureStore.getItemAsync(key);
      return s ? JSON.parse(s) : null;
    },
    setObject: (key: string, obj: any): Promise<void> => {
      return SecureStore.setItemAsync(key, JSON.stringify(obj));
    },
  };
}

export { isMMKV, storage };

