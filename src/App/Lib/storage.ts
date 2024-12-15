export interface IStorageService<T extends object> {
  setItem(key: string, value: T): void;
  getItem(key: string): T | null;
  removeItem(key: string): void;
  clear(): void;
}
