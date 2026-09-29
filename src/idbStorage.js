// High-capacity IndexedDB local storage cache for Iconderry
// Solves browser localStorage 5MB quota limit so heavy traced SVGs and unlimited icons cache instantly without loss.

const DB_NAME = 'iconderry_cache_db';
const DB_VERSION = 1;
const STORE_NAME = 'elements_store';
const KEY = 'all_elements';

export function saveElementsToDB(elements) {
  if (typeof window === 'undefined' || !window.indexedDB || !Array.isArray(elements) || elements.length === 0) {
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e) => {
        try {
          const db = e.target.result;
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put(elements, KEY);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch {
          resolve(false);
        }
      };
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export function loadElementsFromDB() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e) => {
        try {
          const db = e.target.result;
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const getReq = store.get(KEY);
          getReq.onsuccess = () => {
            resolve(getReq.result || null);
          };
          getReq.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}
