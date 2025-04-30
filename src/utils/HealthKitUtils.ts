import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';
import { DailyHealthData } from '../types/health';

export interface HealthKitSummary {
  date: string;
  activeEnergyBurned: number;
  basalEnergyBurned: number;
  totalEnergyBurned: number;
  exerciseMinutes: number;
  weightKg: number | null;
  bodyFatPercentage: number | null;
}

class HealthKitUtils {
  static permissions: HealthKitPermissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
        AppleHealthKit.Constants.Permissions.Carbohydrates,
        AppleHealthKit.Constants.Permissions.Protein,
        AppleHealthKit.Constants.Permissions.FatTotal,
        AppleHealthKit.Constants.Permissions.Dietary,
      ],
      write: [
        AppleHealthKit.Constants.Permissions.Dietary,
      ],
    },
  };

  static async requestAuthorization(): Promise<boolean> {
    console.log('[HealthKitUtils] 権限リクエスト開始');
    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(this.permissions, (error: string) => {
        if (error) {
          console.error('[HealthKitUtils] 権限リクエストエラー:', error);
          reject(new Error(error));
          return;
        }
        console.log('[HealthKitUtils] 権限リクエスト成功');
        resolve(true);
      });
    });
  }

  static async fetchSummary(date: string): Promise<DailyHealthData> {
    console.log(`[HealthKitUtils] ${date}のデータ取得開始`);
    
    const options: HealthInputOptions = {
      date: date,
      includeManuallyAdded: true,
    };

    const [
      activeEnergy,
      basalEnergy,
      carbs,
      protein,
      fat,
      calories,
    ] = await Promise.all([
      this.getActiveEnergy(options),
      this.getBasalEnergy(options),
      this.getNutrient(options, 'carbs'),
      this.getNutrient(options, 'protein'),
      this.getNutrient(options, 'fat'),
      this.getDietaryEnergy(options),
    ]);

    const summary: DailyHealthData = {
      date,
      totalEnergyBurned: Math.round(activeEnergy + basalEnergy),
      totalIntakeCalories: Math.round(calories),
      totalCarbGrams: Math.round(carbs),
      totalProteinGrams: Math.round(protein),
      totalFatGrams: Math.round(fat),
    };

    console.log(`[HealthKitUtils] ${date}のデータ:`, summary);
    return summary;
  }

  private static getActiveEnergy(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(
        options,
        (error: string, results: HealthValue[]) => {
          if (error) {
            console.error('[HealthKitUtils] アクティブエネルギー取得エラー:', error);
            reject(error);
            return;
          }
          const total = results.reduce((sum, item) => sum + item.value, 0);
          resolve(total);
        },
      );
    });
  }

  private static getBasalEnergy(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getBasalEnergyBurned(
        options,
        (error: string, results: HealthValue[]) => {
          if (error) {
            console.error('[HealthKitUtils] 基礎代謝取得エラー:', error);
            reject(error);
            return;
          }
          const total = results.reduce((sum, item) => sum + item.value, 0);
          resolve(total);
        },
      );
    });
  }

  private static getDietaryEnergy(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDietaryEnergy(
        options,
        (error: string, results: { value: number }) => {
          if (error) {
            console.error('[HealthKitUtils] 摂取カロリー取得エラー:', error);
            reject(error);
            return;
          }
          resolve(results.value);
        },
      );
    });
  }

  private static getNutrient(
    options: HealthInputOptions,
    type: 'carbs' | 'protein' | 'fat',
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const method = {
        carbs: AppleHealthKit.getDailyCarbohydrates,
        protein: AppleHealthKit.getDailyProtein,
        fat: AppleHealthKit.getDailyFatTotal,
      }[type];

      method(options, (error: string, results: { value: number }) => {
        if (error) {
          console.error(`[HealthKitUtils] ${type}取得エラー:`, error);
          reject(error);
          return;
        }
        resolve(results.value);
      });
    });
  }
}

export default HealthKitUtils; 