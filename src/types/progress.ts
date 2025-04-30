export interface Progress {
  id: string;
  goalId: string;
  value: number;
  timestamp: number;
  note?: string;
} 