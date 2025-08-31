/*
  Storage wrapper for Chrome storage API (with localStorage fallback)
*/

export const useStorage = () => {
  const hasChromeStorage = window.chrome.storage !== undefined;
  const storage = {
    clear: () => {
      if (hasChromeStorage) return window.chrome.storage.sync.clear();
      localStorage.clear();
      return Promise.resolve();
    },
    get: keys => {
      if (hasChromeStorage) return window.chrome.storage.sync.get(keys);
      
      // Fallback to localStorage
      if (typeof keys === 'string') return Promise.resolve({ [keys]: localStorage.getItem(keys) });
      else if (Array.isArray(keys)) {
        const result = {};
        keys.forEach(key => result[key] = localStorage.getItem(key));
        return Promise.resolve(result);
      }
      else if (keys === undefined) {
        const result = {};
        Object.keys(localStorage).forEach(key => result[key] = localStorage.getItem(key));
        return Promise.resolve(result);
      }
    },
    getKeys: () => {
      if (hasChromeStorage) return window.chrome.storage.sync.getKeys();
      return Promise.resolve(Object.keys(localStorage));
    },
    remove: keys => {
      if (hasChromeStorage) return window.chrome.storage.sync.remove(keys);
      
      // Fallback to localStorage
      if (typeof keys === 'string') localStorage.removeItem(keys);
      else if (Array.isArray(keys)) keys.forEach(key => localStorage.removeItem(key));
      return Promise.resolve();
    },
    set: items => {
      if (hasChromeStorage) return window.chrome.storage.sync.set(items);
      Object.entries(items).forEach(([key, value]) => localStorage.setItem(key, value));
      return Promise.resolve();
    }
  }

  return { storage };
}