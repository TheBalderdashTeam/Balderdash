// Use 'local' for localStorage or 'session' for sessionStorage
const getStorage = (type = 'local') =>
  type === 'session' ? window.sessionStorage : window.localStorage;

export function setItem(key, value, type = 'local') {
  const storage = getStorage(type);
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to set storage item:', error);
  }
}

export function getItem(key, type = 'local') {
  const storage = getStorage(type);
  try {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to parse storage item:', error);
    return null;
  }
}

export function removeItem(key, type = 'local') {
  const storage = getStorage(type);
  storage.removeItem(key);
}

export function clearStorage(type = 'local') {
  const storage = getStorage(type);
  storage.clear();
}