/*
  Storage wrapper for Chrome storage API (with localStorage fallback)
*/

export const useStorage = () => {
  const hasChromeStorage = window.chrome.storage !== undefined;

  const get = keys => {
    // Use Chrome storage if available
    if (hasChromeStorage) {
      return window.chrome.storage.sync.get(keys);
    }

    // Use localStorage as fallback
    if (typeof keys === 'string') {
      return Promise.resolve({ [keys]: localStorage.getItem(keys) });
    }
    else if (Array.isArray(keys)) {
      const result = {};
      keys.forEach(key => result[key] = localStorage.getItem(key));
      return Promise.resolve(result);
    }
  }

  const getKeys = () => {
    // Use Chrome storage if available
    if (hasChromeStorage) {
      return window.chrome.storage.sync.getKeys();
    }

    // Use localStorage as fallback
    return Promise.resolve(Object.keys(localStorage));
  }

  const set = (items) => {
    // Use Chrome storage if available
    if (hasChromeStorage) {
      return window.chrome.storage.sync.set(items);
    }

    // Use localStorage as fallback
    Object.entries(items).forEach(([key, value]) => localStorage.setItem(key, value));
    return Promise.resolve();
  }

  const remove = (keys) => {
    // Use Chrome storage if available
    if (hasChromeStorage) {
      return window.chrome.storage.sync.remove(keys);
    }

    // Use localStorage as fallback
    if (typeof keys === 'string') {
      localStorage.removeItem(keys);
    }
    else if (Array.isArray(keys)) {
      keys.forEach(key => localStorage.removeItem(key));
    }
    return Promise.resolve();
  }

  const clear = () => {
    // Use Chrome storage if available
    if (hasChromeStorage) {
      return window.chrome.storage.sync.clear();
    }

    // Use localStorage as fallback
    localStorage.clear();
    return Promise.resolve();
  }

  return {
    clear,
    get,
    getKeys,
    remove,
    set
  }
}