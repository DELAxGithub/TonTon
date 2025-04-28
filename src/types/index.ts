export interface MealRecord {
  id: string;
  timestamp: number;
  calories: number;
  description: string;
  imageUrl?: string;
}

export interface WorkoutRecord {
  id: string;
  timestamp: number;
  calories: number;
  type: string;
  duration: number;
}

export interface DailySummary {
  date: string;
  totalIntakeCalories: number;
  totalBurnedCalories: number;
  balance: number;
  meals: MealRecord[];
  workouts: WorkoutRecord[];
}

export interface UserSettings {
  openaiApiKey?: string;
  dailyCalorieGoal: number;
} 