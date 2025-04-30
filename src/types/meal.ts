/**
 * 食事の種類の定数定義
 */
export const MEAL_TYPES = {
  BREAKFAST: '朝食',
  LUNCH: '昼食',
  DINNER: '夕食',
  SNACK: 'おやつ'
} as const;

/**
 * 食事の種類の型定義
 */
export type MealType = keyof typeof MEAL_TYPES;

/**
 * 食事記録の型定義
 */
export interface MealRecord {
  /** レコードの一意識別子 */
  id: string;
  
  /** 記録日（YYYY-MM-DD形式） */
  date: string;
  
  /** タイムスタンプ（ミリ秒） */
  timestamp: number;
  
  /** 食事の種類 */
  mealType: MealType;
  
  /** 食事内容の説明 */
  description: string;
  
  /** 写真のURL（オプション） */
  photoUrl?: string;
  
  /** メモ（オプション） */
  note?: string;
} 