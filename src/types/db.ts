
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  memo: string;
  timings: string[]; // 服用タイミング（起床・朝・昼・夕・眠前）
}

export interface MedicationRecord {
  id: string;
  date: string; // YYYY-MM-DD形式
  time: string; // HH:MM形式
  timing: string; // 服用タイミング
  medications: Array<{
    name: string;
    dosage: string;
    actualDosage?: string;
    memo?: string;
  }>;
  recordMemo?: string;
}
