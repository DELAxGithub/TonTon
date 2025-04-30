export interface MealRecord {
  id: string;
  date: string;
  estimatedCalories: number;
  proteinGrams?: number;
  fatGrams?: number;
  carbGrams?: number;
  memo?: string;
  mealType: string;
}

export interface WorkoutRecord {
  id: string;
  date: string;
  workoutType: string;
  activeCaloriesBurned: number;
  totalCaloriesBurned: number;
  durationMinutes: number;
  source: string;
}

export interface BodyRecord {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercentage: number;
}

export interface DailySummary {
  date: string;
  totalIntakeCalories: number;
  totalEnergyBurned: number;
  netCalories: number;
  bodyWeight: number;
  bodyFatPercentage: number;
  activeCaloriesBurned: number;
  exerciseMinutes: number;
  meals: MealRecord[];
  workouts: WorkoutRecord[];
}

export interface UserSettings {
  openaiApiKey?: string;
  dailyCalorieGoal: number;
} 