import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'billingmaster-db';
const DB_VERSION = 1;

export const CACHE_STORE = 'offline-cache';

let dbPromise: Promise<IDBPDatabase> | null = null;

export const getDb = (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CACHE_STORE)) {
          db.createObjectStore(CACHE_STORE);
        }
      },
    });
  }
  return dbPromise;
};

/** Persists a snapshot of frequently-needed reference data (e.g. the product catalog) for offline use. */
export const setCachedValue = async <T>(key: string, value: T): Promise<void> => {
  const db = await getDb();
  await db.put(CACHE_STORE, { value, cachedAt: Date.now() }, key);
};

export const getCachedValue = async <T>(key: string): Promise<T | undefined> => {
  const db = await getDb();
  const record = await db.get(CACHE_STORE, key);
  return record?.value as T | undefined;
};

export const clearCachedValue = async (key: string): Promise<void> => {
  const db = await getDb();
  await db.delete(CACHE_STORE, key);
};
