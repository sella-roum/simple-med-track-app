
import { Medication, MedicationRecord } from '@/types/db';

const DB_NAME = 'MedTrackDB';
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 薬剤情報ストア
      if (!db.objectStoreNames.contains('medications')) {
        const medicationStore = db.createObjectStore('medications', { keyPath: 'id' });
        medicationStore.createIndex('name', 'name', { unique: false });
      }

      // 服薬記録ストア
      if (!db.objectStoreNames.contains('medicationRecords')) {
        const recordStore = db.createObjectStore('medicationRecords', { keyPath: 'id' });
        recordStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

// 薬剤関連の操作
export const addMedication = async (medication: Omit<Medication, 'id'>): Promise<Medication> => {
  const db = await openDB();
  const newMedication: Medication = {
    ...medication,
    id: crypto.randomUUID(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medications'], 'readwrite');
    const store = transaction.objectStore('medications');
    const request = store.add(newMedication);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newMedication);
  });
};

export const getAllMedications = async (): Promise<Medication[]> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medications'], 'readonly');
    const store = transaction.objectStore('medications');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const updateMedication = async (medication: Medication): Promise<void> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medications'], 'readwrite');
    const store = transaction.objectStore('medications');
    const request = store.put(medication);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteMedication = async (id: string): Promise<void> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medications'], 'readwrite');
    const store = transaction.objectStore('medications');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// 服薬記録関連の操作
export const addMedicationRecord = async (record: Omit<MedicationRecord, 'id'>): Promise<MedicationRecord> => {
  const db = await openDB();
  const newRecord: MedicationRecord = {
    ...record,
    id: crypto.randomUUID(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medicationRecords'], 'readwrite');
    const store = transaction.objectStore('medicationRecords');
    const request = store.add(newRecord);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newRecord);
  });
};

export const getAllMedicationRecords = async (): Promise<MedicationRecord[]> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medicationRecords'], 'readonly');
    const store = transaction.objectStore('medicationRecords');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getMedicationRecordsByDateRange = async (startDate: string, endDate: string): Promise<MedicationRecord[]> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medicationRecords'], 'readonly');
    const store = transaction.objectStore('medicationRecords');
    const index = store.index('date');
    const range = IDBKeyRange.bound(startDate, endDate);
    const request = index.getAll(range);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const updateMedicationRecord = async (record: MedicationRecord): Promise<void> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medicationRecords'], 'readwrite');
    const store = transaction.objectStore('medicationRecords');
    const request = store.put(record);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteMedicationRecord = async (id: string): Promise<void> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['medicationRecords'], 'readwrite');
    const store = transaction.objectStore('medicationRecords');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
