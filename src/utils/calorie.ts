import { MealRecord, WorkoutRecord, DailySummary } from '../types';
import { Storage } from '../storage/storage';

export class CalorieUtils {
  private static readonly MEALS_KEY = 'meals';
  private static readonly WORKOUTS_KEY = 'workouts';

  // 日付文字列を取得（YYYY-MM-DD形式）
  static getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  // タイムスタンプから日付文字列を取得
  static getDateStringFromTimestamp(timestamp: number): string {
    return new Date(timestamp).toISOString().split('T')[0];
  }

  // 指定日の食事カロリー合計を計算
  static calculateDailyIntakeCalories(meals: MealRecord[]): number {
    return meals.reduce((total, meal) => total + meal.calories, 0);
  }

  // 指定日の消費カロリー合計を計算
  static calculateDailyBurnedCalories(workouts: WorkoutRecord[]): number {
    return workouts.reduce((total, workout) => total + workout.calories, 0);
  }

  // 指定日のカロリー収支を計算
  static calculateDailyBalance(meals: MealRecord[], workouts: WorkoutRecord[]): number {
    const intakeCalories = this.calculateDailyIntakeCalories(meals);
    const burnedCalories = this.calculateDailyBurnedCalories(workouts);
    return burnedCalories - intakeCalories;
  }

  // 日次サマリーを更新
  static async updateDailySummary(date: string = this.getDateString()): Promise<DailySummary> {
    const meals = await Storage.getArray<MealRecord>(this.MEALS_KEY);
    const workouts = await Storage.getArray<WorkoutRecord>(this.WORKOUTS_KEY);

    const filteredMeals = meals.filter(meal => 
      this.getDateStringFromTimestamp(meal.timestamp) === date
    );
    const filteredWorkouts = workouts.filter(workout => 
      this.getDateStringFromTimestamp(workout.timestamp) === date
    );

    const summary: DailySummary = {
      date,
      totalIntakeCalories: this.calculateDailyIntakeCalories(filteredMeals),
      totalBurnedCalories: this.calculateDailyBurnedCalories(filteredWorkouts),
      balance: this.calculateDailyBalance(filteredMeals, filteredWorkouts),
      meals: filteredMeals,
      workouts: filteredWorkouts,
    };

    await Storage.setArray(this.MEALS_KEY, meals);
    await Storage.setArray(this.WORKOUTS_KEY, workouts);
    return summary;
  }

  // 新しい食事記録を追加
  static async addMeal(meal: Omit<MealRecord, 'id'>): Promise<void> {
    try {
      console.log('Adding meal:', meal);
      const meals = await Storage.getArray<MealRecord>(this.MEALS_KEY);
      const newMeal: MealRecord = {
        ...meal,
        id: Date.now().toString(),
      };
      meals.push(newMeal);
      await Storage.setArray(this.MEALS_KEY, meals);
      await this.updateDailySummary(this.getDateStringFromTimestamp(meal.timestamp));
      console.log('Meal added successfully:', newMeal);
    } catch (error) {
      console.error('Failed to add meal:', error);
      throw error;
    }
  }

  // 新しい運動記録を追加
  static async addWorkout(workout: Omit<WorkoutRecord, 'id' | 'timestamp'>): Promise<void> {
    try {
      console.log('CalorieUtils: 運動データを追加します:', workout);
      
      const workouts = await Storage.getArray<WorkoutRecord>(this.WORKOUTS_KEY);
      console.log('CalorieUtils: 既存の運動データ:', workouts);
      
      const now = Date.now();
      const newWorkout: WorkoutRecord = {
        ...workout,
        id: now.toString(),
        timestamp: now,
      };
      console.log('CalorieUtils: 新しい運動データ:', newWorkout);
      
      workouts.push(newWorkout);
      await Storage.setArray(this.WORKOUTS_KEY, workouts);
      console.log('CalorieUtils: 運動データを保存しました');
      
      const date = this.getDateStringFromTimestamp(newWorkout.timestamp);
      await this.updateDailySummary(date);
      console.log('CalorieUtils: 日次サマリーを更新しました:', date);
    } catch (error) {
      console.error('CalorieUtils: 運動データの保存に失敗しました:', error);
      throw error;
    }
  }

  static async updateWorkout(id: string, workout: Omit<WorkoutRecord, 'id'>): Promise<void> {
    const workouts = await Storage.getArray<WorkoutRecord>(this.WORKOUTS_KEY);
    const index = workouts.findIndex(w => w.id === id);
    if (index === -1) {
      throw new Error('運動データが見つかりません');
    }
    
    workouts[index] = {
      ...workout,
      id,
    };
    await Storage.setArray(this.WORKOUTS_KEY, workouts);
    await this.updateDailySummary(this.getDateStringFromTimestamp(workout.timestamp));
  }

  static async deleteWorkout(id: string): Promise<void> {
    const workouts = await Storage.getArray<WorkoutRecord>(this.WORKOUTS_KEY);
    const filteredWorkouts = workouts.filter(workout => workout.id !== id);
    if (filteredWorkouts.length === workouts.length) {
      throw new Error('運動データが見つかりません');
    }
    await Storage.setArray(this.WORKOUTS_KEY, filteredWorkouts);
    await this.updateDailySummary();
  }

  static async getDailyCalories(date: string = this.getDateString()): Promise<{
    intake: number;
    burned: number;
    balance: number;
  }> {
    const [meals, workouts] = await Promise.all([
      Storage.getArray<MealRecord>(this.MEALS_KEY),
      Storage.getArray<WorkoutRecord>(this.WORKOUTS_KEY),
    ]);

    const filteredMeals = meals.filter(meal => 
      this.getDateStringFromTimestamp(meal.timestamp) === date
    );
    const filteredWorkouts = workouts.filter(workout => 
      this.getDateStringFromTimestamp(workout.timestamp) === date
    );

    const intake = this.calculateDailyIntakeCalories(filteredMeals);
    const burned = this.calculateDailyBurnedCalories(filteredWorkouts);

    return {
      intake,
      burned,
      balance: burned - intake,
    };
  }
} 