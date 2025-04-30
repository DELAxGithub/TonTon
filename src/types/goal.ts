export interface Goal {
  id: string;
  type: 'weight' | 'exercise' | 'nutrition';
  target: number;
  current: number;
  unit: string;
  startDate: number;
  endDate: number;
  progress: number;
  status: 'active' | 'completed' | 'failed';
} 