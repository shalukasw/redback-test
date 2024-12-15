import { IStorageService } from './storage';

class LocalStorageService<T extends object> implements IStorageService<T> {
  setItem(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

export default LocalStorageService;
