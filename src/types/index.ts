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

// 基本データ型
export interface DailyBalance {
  date: string;
  intake: number;
  burned: number;
  net: number;
}

export interface MonthlyGoal {
  month: string;
  current: number;
  goal: number;
  remaining: number;
  percent: number;
}

// コンポーネントのProps型
export interface MonthlySavingProgressProps {
  data: {
    percent: number;
    current: number;
    goal: number;
    remaining: number;
  };
}

export interface BalanceProps {
  data: {
    intake: number;
    burned: number;
    net: number;
  };
}

// ナビゲーション用の型
export type RootStackParamList = {
  Home: undefined;
  Weight: undefined;
  Meal: undefined;
  Workout: undefined;
  Record: undefined;
}; 