export interface Advice {
  id: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'lifestyle';
  timestamp: number;
  isRead: boolean;
} 