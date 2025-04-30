import { DailyHealthData } from '../types/health';
import { HealthKitPermissions } from '../types/permissions';
import AppleHealthKit, { 
  HealthInputOptions, 
  HealthValue
} from 'react-native-health';

export class HealthKitService {
  private static instance: HealthKitService;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): HealthKitService {
    if (!HealthKitService.instance) {
      HealthKitService.instance = new HealthKitService();
    }
    return HealthKitService.instance;
  }

  public async initialize(permissions: HealthKitPermissions): Promise<void> {
    if (this.initialized) return;

    try {
      await AppleHealthKit.initHealthKit(permissions);
      this.initialized = true;
      console.log('HealthKit initialized successfully');
    } catch (error) {
      console.error('Error initializing HealthKit:', error);
      throw error;
    }
  }

  public async getDailyHealthData(date: string): Promise<DailyHealthData> {
    if (!this.initialized) {
      throw new Error('HealthKit not initialized');
    }

    const options: HealthInputOptions = {
      date: date,
      includeManuallyAdded: true,
    };

    try {
      const [energyBurned, intakeCalories] = await Promise.all([
        this.getActiveEnergyBurned(options),
        this.getDietaryEnergy(options),
      ]);

      const [carbGrams, proteinGrams, fatGrams] = await Promise.all([
        this.getDietaryCarbs(options),
        this.getDietaryProtein(options),
        this.getDietaryFat(options),
      ]);

      return {
        date,
        totalEnergyBurned: energyBurned,
        totalIntakeCalories: intakeCalories,
        totalCarbGrams: carbGrams,
        totalProteinGrams: proteinGrams,
        totalFatGrams: fatGrams,
      };
    } catch (error) {
      console.error('Error getting daily health data:', error);
      throw error;
    }
  }

  private getActiveEnergyBurned(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(
        options,
        (error: string, results: HealthValue) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results.value || 0);
        },
      );
    });
  }

  private getDietaryEnergy(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDietaryEnergy(
        options,
        (error: string, results: HealthValue) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results.value || 0);
        },
      );
    });
  }

  private getDietaryCarbs(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDietaryCarbs(
        options,
        (error: string, results: HealthValue) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results.value || 0);
        },
      );
    });
  }

  private getDietaryProtein(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDietaryProtein(
        options,
        (error: string, results: HealthValue) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results.value || 0);
        },
      );
    });
  }

  private getDietaryFat(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDietaryFat(
        options,
        (error: string, results: HealthValue) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results.value || 0);
        },
      );
    });
  }
} 