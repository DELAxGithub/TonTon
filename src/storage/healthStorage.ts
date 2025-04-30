import { storage } from './mmkv';
import { HealthKitSummary } from '../utils/HealthKitUtils';

export class HealthStorage {
  private static readonly PREFIX = 'health_';

  static saveDailyHealthData(data: HealthKitSummary): boolean {
    try {
      const key = `${this.PREFIX}${data.date}`;
      storage.set(key, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('HealthDataの保存に失敗:', err);
      return false;
    }
  }
  
  static getDailyHealthData(date: string): HealthKitSummary | null {
    try {
      const key = `${this.PREFIX}${date}`;
      const savedData = storage.getString(key);
      return savedData ? JSON.parse(savedData) : null;
    } catch (err) {
      console.error('HealthDataの取得に失敗:', err);
      return null;
    }
  }

  static getAllHealthData(): Record<string, HealthKitSummary> {
    try {
      const allKeys = storage.getAllKeys();
      const healthKeys = allKeys.filter(key => key.startsWith(this.PREFIX));
      const result: Record<string, HealthKitSummary> = {};

      healthKeys.forEach(key => {
        const data = storage.getString(key);
        if (data) {
          const parsedData = JSON.parse(data) as HealthKitSummary;
          result[parsedData.date] = parsedData;
        }
      });

      return result;
    } catch (err) {
      console.error('全HealthDataの取得に失敗:', err);
      return {};
    }
  }
} 