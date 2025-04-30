import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthValue,
} from 'react-native-health';
import {DailyHealthData, HealthKitError} from '../types/health';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.Carbohydrates,
      AppleHealthKit.Constants.Permissions.Protein,
      AppleHealthKit.Constants.Permissions.FatTotal,
      AppleHealthKit.Constants.Permissions.DietaryEnergyConsumed,
    ],
    write: [],
  },
};

export const initHealthKit = async (): Promise<void> => {
  try {
    await AppleHealthKit.initHealthKit(permissions);
  } catch (error) {
    const healthError = error as HealthKitError;
    console.error('HealthKit initialization failed:', healthError);
    throw healthError;
  }
};

export const getDailyHealthData = async (date: string): Promise<DailyHealthData> => {
  try {
    const options: HealthInputOptions = {
      date: date,
      includeManuallyAdded: true,
    };

    // 消費カロリーを取得
    const energyBurned = await new Promise<number>((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(
        options,
        (error: HealthKitError | undefined, results: HealthValue[]) => {
          if (error) {
            reject(error);
            return;
          }
          const totalEnergyBurned = results.reduce(
            (sum, item) => sum + item.value,
            0,
          );
          resolve(totalEnergyBurned);
        },
      );
    });

    // 摂取カロリーを取得
    const caloriesConsumed = await new Promise<number>((resolve, reject) => {
      AppleHealthKit.getDietaryEnergyConsumed(
        options,
        (error: HealthKitError | undefined, results: HealthValue[]) => {
          if (error) {
            reject(error);
            return;
          }
          const totalCalories = results.reduce(
            (sum, item) => sum + item.value,
            0,
          );
          resolve(totalCalories);
        },
      );
    });

    // 炭水化物を取得
    const carbs = await new Promise<number>((resolve, reject) => {
      AppleHealthKit.getCarbohydrates(
        options,
        (error: HealthKitError | undefined, results: HealthValue[]) => {
          if (error) {
            reject(error);
            return;
          }
          const totalCarbs = results.reduce(
            (sum, item) => sum + item.value,
            0,
          );
          resolve(totalCarbs);
        },
      );
    });

    // タンパク質を取得
    const protein = await new Promise<number>((resolve, reject) => {
      AppleHealthKit.getProtein(
        options,
        (error: HealthKitError | undefined, results: HealthValue[]) => {
          if (error) {
            reject(error);
            return;
          }
          const totalProtein = results.reduce(
            (sum, item) => sum + item.value,
            0,
          );
          resolve(totalProtein);
        },
      );
    });

    // 脂質を取得
    const fat = await new Promise<number>((resolve, reject) => {
      AppleHealthKit.getFatTotal(
        options,
        (error: HealthKitError | undefined, results: HealthValue[]) => {
          if (error) {
            reject(error);
            return;
          }
          const totalFat = results.reduce(
            (sum, item) => sum + item.value,
            0,
          );
          resolve(totalFat);
        },
      );
    });

    return {
      date,
      totalEnergyBurned: Math.round(energyBurned),
      totalIntakeCalories: Math.round(caloriesConsumed),
      totalCarbGrams: Math.round(carbs),
      totalProteinGrams: Math.round(protein),
      totalFatGrams: Math.round(fat),
    };
  } catch (error) {
    const healthError = error as HealthKitError;
    console.error('Failed to get health data:', healthError);
    throw healthError;
  }
}; 