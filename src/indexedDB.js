/*
 * Copyright 2026 Jeffrey Guntly (JX Holdings, LLC)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * IndexedDB utilities for Era Manifesto
 * Provides persistent storage for backups and archives
 */

const DB_NAME = 'era-manifesto-storage';
const DB_VERSION = 1;
const STORE_BACKUPS = 'backups';
const STORE_ARCHIVES = 'archives';

/**
 * Initialize IndexedDB database
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create backups store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_BACKUPS)) {
        const backupStore = db.createObjectStore(STORE_BACKUPS, { keyPath: 'id' });
        backupStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Create archives store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_ARCHIVES)) {
        const archiveStore = db.createObjectStore(STORE_ARCHIVES, { keyPath: 'id' });
        archiveStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

/**
 * Save a backup to IndexedDB
 * @param {Object} data - The data to backup
 * @returns {Promise<string>} - The backup ID
 */
export const saveBackup = async (data) => {
  const db = await initDB();
  const id = `backup-${Date.now()}`;
  const backup = {
    id,
    timestamp: new Date().toISOString(),
    data,
    size: JSON.stringify(data).length
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_BACKUPS], 'readwrite');
    const store = transaction.objectStore(STORE_BACKUPS);
    const request = store.add(backup);

    request.onsuccess = () => {
      // Keep only the last 10 backups
      pruneOldBackups(db, 10);
      resolve(id);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all backups from IndexedDB
 * @returns {Promise<Array>} - Array of backup objects
 */
export const getAllBackups = async () => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_BACKUPS], 'readonly');
    const store = transaction.objectStore(STORE_BACKUPS);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort by timestamp descending (newest first)
      const backups = request.result.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      resolve(backups);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get a specific backup by ID
 * @param {string} id - The backup ID
 * @returns {Promise<Object>} - The backup object
 */
export const getBackup = async (id) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_BACKUPS], 'readonly');
    const store = transaction.objectStore(STORE_BACKUPS);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete a backup by ID
 * @param {string} id - The backup ID
 */
export const deleteBackup = async (id) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_BACKUPS], 'readwrite');
    const store = transaction.objectStore(STORE_BACKUPS);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Prune old backups to keep only the specified number
 * @param {IDBDatabase} db - The database instance
 * @param {number} keepCount - Number of backups to keep
 */
const pruneOldBackups = async (db, keepCount = 10) => {
  const transaction = db.transaction([STORE_BACKUPS], 'readwrite');
  const store = transaction.objectStore(STORE_BACKUPS);
  const index = store.index('timestamp');
  const request = index.openCursor(null, 'prev'); // Sort by timestamp descending

  const backups = [];
  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      backups.push(cursor.value.id);
      cursor.continue();
    } else {
      // Delete old backups beyond keepCount
      if (backups.length > keepCount) {
        const toDelete = backups.slice(keepCount);
        toDelete.forEach(id => {
          store.delete(id);
        });
      }
    }
  };
};

/**
 * Save an archive snapshot to IndexedDB
 * @param {Object} data - The data to archive
 * @param {string} description - Description of the archive
 * @returns {Promise<string>} - The archive ID
 */
export const saveArchive = async (data, description = '') => {
  const db = await initDB();
  const id = `archive-${Date.now()}`;
  const archive = {
    id,
    timestamp: new Date().toISOString(),
    description,
    data,
    size: JSON.stringify(data).length
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_ARCHIVES], 'readwrite');
    const store = transaction.objectStore(STORE_ARCHIVES);
    const request = store.add(archive);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all archives from IndexedDB
 * @returns {Promise<Array>} - Array of archive objects
 */
export const getAllArchives = async () => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_ARCHIVES], 'readonly');
    const store = transaction.objectStore(STORE_ARCHIVES);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort by timestamp descending (newest first)
      const archives = request.result.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      resolve(archives);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get a specific archive by ID
 * @param {string} id - The archive ID
 * @returns {Promise<Object>} - The archive object
 */
export const getArchive = async (id) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_ARCHIVES], 'readonly');
    const store = transaction.objectStore(STORE_ARCHIVES);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete an archive by ID
 * @param {string} id - The archive ID
 */
export const deleteArchive = async (id) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_ARCHIVES], 'readwrite');
    const store = transaction.objectStore(STORE_ARCHIVES);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get the total size of all stored data
 * @returns {Promise<Object>} - Object with backup and archive sizes
 */
export const getStorageSize = async () => {
  const backups = await getAllBackups();
  const archives = await getAllArchives();

  const backupSize = backups.reduce((sum, b) => sum + (b.size || 0), 0);
  const archiveSize = archives.reduce((sum, a) => sum + (a.size || 0), 0);

  return {
    backupSize,
    archiveSize,
    totalSize: backupSize + archiveSize,
    backupCount: backups.length,
    archiveCount: archives.length
  };
};
