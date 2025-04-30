export interface HealthData {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  timestamp: number;
}

export interface DailyHealthData {
  date: string;
  totalEnergyBurned: number;
  totalIntakeCalories: number;
  totalCarbGrams: number;
  totalProteinGrams: number;
  totalFatGrams: number;
}

export interface HealthKitError extends Error {
  code?: string;
  domain?: string;
} 