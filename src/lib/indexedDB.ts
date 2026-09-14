export const initDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('BaraAppDB', 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('wallpapers')) {
        db.createObjectStore('wallpapers');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveWallpaper = async (dataUrl: string, type: string) => {
  const db = await initDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('wallpapers', 'readwrite');
    const store = tx.objectStore('wallpapers');
    store.put({ dataUrl, type }, 'room_wallpaper');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getWallpaper = async () => {
  const db = await initDB();
  return new Promise<{dataUrl: string, type: string} | null>((resolve, reject) => {
    const tx = db.transaction('wallpapers', 'readonly');
    const store = tx.objectStore('wallpapers');
    const request = store.get('room_wallpaper');
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const deleteWallpaper = async () => {
  const db = await initDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('wallpapers', 'readwrite');
    const store = tx.objectStore('wallpapers');
    store.delete('room_wallpaper');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
