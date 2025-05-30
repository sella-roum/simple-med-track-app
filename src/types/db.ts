
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  memo: string;
}

export interface MedicationRecord {
  id: string;
  date: string; // YYYY-MM-DD形式
  time: string; // HH:MM形式
  medications: Array<{
    name: string;
    dosage: string;
    actualDosage?: string;
    memo?: string;
  }>;
  recordMemo?: string;
}
