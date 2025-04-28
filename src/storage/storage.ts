import { storage, STORAGE_KEYS } from './mmkv';
import { MealRecord, WorkoutRecord, DailySummary, UserSettings } from '../types';

export class Storage {
  // 汎用的な配列の取得と保存
  static getArray<T>(key: string): T[] {
    const value = storage.getString(key);
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  static setArray<T>(key: string, array: T[]): void {
    storage.set(key, JSON.stringify(array));
  }

  // 食事記録の保存と取得
  static saveMeal(meal: MealRecord): void {
    const meals = this.getArray<MealRecord>(STORAGE_KEYS.MEALS);
    meals.push(meal);
    this.setArray(STORAGE_KEYS.MEALS, meals);
  }

  static getMeals(): MealRecord[] {
    return this.getArray<MealRecord>(STORAGE_KEYS.MEALS);
  }

  // 運動記録の保存と取得
  static saveWorkout(workout: WorkoutRecord): void {
    const workouts = this.getArray<WorkoutRecord>(STORAGE_KEYS.WORKOUTS);
    workouts.push(workout);
    this.setArray(STORAGE_KEYS.WORKOUTS, workouts);
  }

  static getWorkouts(): WorkoutRecord[] {
    return this.getArray<WorkoutRecord>(STORAGE_KEYS.WORKOUTS);
  }

  // 日次サマリーの保存と取得
  static saveDailySummary(summary: DailySummary): void {
    const summaries = this.getArray<DailySummary>(STORAGE_KEYS.DAILY_SUMMARIES);
    const existingIndex = summaries.findIndex(s => s.date === summary.date);
    
    if (existingIndex >= 0) {
      summaries[existingIndex] = summary;
    } else {
      summaries.push(summary);
    }
    
    this.setArray(STORAGE_KEYS.DAILY_SUMMARIES, summaries);
  }

  static getDailySummaries(): DailySummary[] {
    return this.getArray<DailySummary>(STORAGE_KEYS.DAILY_SUMMARIES);
  }

  static getDailySummaryByDate(date: string): DailySummary | null {
    const summaries = this.getDailySummaries();
    return summaries.find(s => s.date === date) || null;
  }

  // ユーザー設定の保存と取得
  static saveSettings(settings: UserSettings): void {
    storage.set(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  }

  static getSettings(): UserSettings | null {
    const settingsJson = storage.getString(STORAGE_KEYS.USER_SETTINGS);
    return settingsJson ? JSON.parse(settingsJson) : null;
  }

  // データのクリア
  static clearAll(): void {
    storage.clearAll();
  }
} 