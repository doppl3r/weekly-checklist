/*
  The following code is a storage wrapper for Chrome storage API.
  This is useful for development/testing in local environments where the
  Chrome storage API is not available.
*/
import { Storage } from '../../types/types';

declare global {
  interface Window {
    chrome?: any;
  }
}

export const useStorage = (): { storage: Storage } => {
  const hasChromeStorage = typeof window !== 'undefined' && !!window.chrome && !!window.chrome.storage;
  const storage: Storage = {
    clear: () => {
      if (hasChromeStorage) return window.chrome.storage.sync.clear();
      localStorage.clear();
      return Promise.resolve();
    },
    get: (keys?: string | string[]) => {
      if (hasChromeStorage) return window.chrome.storage.sync.get(keys);

      // Fallback to localStorage
      if (typeof keys === 'string') return Promise.resolve({ [keys]: JSON.parse(localStorage.getItem(keys) || '{}') });
      else if (Array.isArray(keys)) {
        const result: Record<string, any> = {};
        keys.forEach(key => result[key] = JSON.parse(localStorage.getItem(key) || '{}'));
        return Promise.resolve(result);
      }
      else if (keys === undefined) {
        const result: Record<string, any> = {};
        Object.keys(localStorage).forEach(key => result[key] = JSON.parse(localStorage.getItem(key) || '{}'));
        return Promise.resolve(result);
      }
      return Promise.resolve({});
    },
    getKeys: () => {
      if (hasChromeStorage) return window.chrome.storage.sync.getKeys();
      return Promise.resolve(Object.keys(localStorage));
    },
    onChanged: (callback: (changes: any, namespace: string) => void) => {
      if (hasChromeStorage) {
        window.chrome.storage.onChanged.addListener(callback);
      }
    },
    remove: (keys: string | string[]) => {
      if (hasChromeStorage) return window.chrome.storage.sync.remove(keys);

      // Fallback to localStorage
      if (typeof keys === 'string') localStorage.removeItem(keys);
      else if (Array.isArray(keys)) keys.forEach(key => localStorage.removeItem(key));
      return Promise.resolve();
    },
    set: (items: Record<string, any>) => {
      if (hasChromeStorage) return window.chrome.storage.sync.set(items);
      Object.entries(items).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
      return Promise.resolve();
    }
  };

  return { storage };
};