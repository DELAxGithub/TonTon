import { NativeModules, Platform } from 'react-native';
import { CalorieUtils } from './calorie';

const { HealthKitManager } = NativeModules;

interface CaloriesResponse {
  activeCalories: number;
  basalCalories: number;
  totalCalories: number;
}

interface WorkoutResponse {
  type: string;
  duration: number;
  calories: number;
  startDate: string;
  endDate: string;
}

export class HealthKitUtils {
  private static isAvailable = false;

  static async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    try {
      this.isAvailable = await HealthKitManager.checkAvailability();
      return this.isAvailable;
    } catch (error) {
      console.warn('HealthKit initialization failed:', error);
      return false;
    }
  }

  static async getTodayCalories(): Promise<CaloriesResponse | null> {
    if (!this.isAvailable || Platform.OS !== 'ios') {
      return null;
    }

    try {
      const today = CalorieUtils.getDateString();
      return await HealthKitManager.getCalories(today);
    } catch (error) {
      console.warn('Failed to get calories:', error);
      return null;
    }
  }

  static async getWorkouts(date: string): Promise<WorkoutResponse[]> {
    if (!this.isAvailable || Platform.OS !== 'ios') {
      return [];
    }

    try {
      return await HealthKitManager.getWorkouts(date);
    } catch (error) {
      console.warn('Failed to get workouts:', error);
      return [];
    }
  }

  static async syncTodayWorkouts(): Promise<void> {
    if (!this.isAvailable || Platform.OS !== 'ios') {
      return;
    }

    try {
      const today = CalorieUtils.getDateString();
      const workouts = await this.getWorkouts(today);

      for (const workout of workouts) {
        await CalorieUtils.addWorkout({
          type: workout.type,
          duration: workout.duration,
          calories: workout.calories,
        });
      }
    } catch (error) {
      console.warn('Failed to sync workouts:', error);
    }
  }
} 