import { useCallback, useEffect, useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { useHealthKit } from './useHealthKit';
import { storage } from '../storage/mmkv';
import { HealthStorage } from '../storage/healthStorage';
import { CalorieUtils } from '../utils/calorieUtils';
import { DailySummary, MealRecord, WorkoutRecord, BodyRecord } from '../types/records';

const STORAGE_KEYS = {
  MEALS: 'meals',
  WORKOUTS: 'workouts',
  BODY_RECORDS: 'bodyRecords',
} as const;

interface UseDailySummaryResult {
  summary: DailySummary | null;
  loading: boolean;
  error: string | null;
  isLoading: boolean;
}

export const useDailySummary = (date: string): UseDailySummaryResult => {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthorized, isLoading, getActiveCalories, getSteps } = useHealthKit();

  // メモ化されたデータ取得関数
  const fetchStoredData = useCallback(async () => {
    try {
      const [meals, workouts, bodyRecords] = await Promise.all([
        storage.getArray<MealRecord>(STORAGE_KEYS.MEALS),
        storage.getArray<WorkoutRecord>(STORAGE_KEYS.WORKOUTS),
        storage.getArray<BodyRecord>(STORAGE_KEYS.BODY_RECORDS),
      ]);
      return { meals, workouts, bodyRecords };
    } catch (e) {
      throw new Error(`データ取得エラー: ${e instanceof Error ? e.message : '不明なエラー'}`);
    }
  }, []);

  // メモ化された日付フィルタリング
  const filterByDate = useCallback((
    data: { meals: MealRecord[], workouts: WorkoutRecord[], bodyRecords: BodyRecord[] }
  ) => {
    const dayMeals = data.meals.filter(m => m.date === date);
    const dayWorkouts = data.workouts.filter(w => w.date === date);
    const dayBodyRecord = data.bodyRecords.find(b => b.date === date) ?? null;
    return { dayMeals, dayWorkouts, dayBodyRecord };
  }, [date]);

  useEffect(() => {
    let isMounted = true;

    const loadDailySummary = async () => {
      try {
        setLoading(true);
        setError(null);

        // データ取得
        const storedData = await fetchStoredData();
        const { dayMeals, dayWorkouts, dayBodyRecord } = filterByDate(storedData);
        
        // HealthKitデータを取得（当日・前日のみ）
        let healthData = null;
        if (isAuthorized && (isToday(new Date(date)) || isYesterday(new Date(date)))) {
          try {
            const [activeCalories, steps] = await Promise.all([
              getActiveCalories(date, date),
              getSteps(date, date)
            ]);
            healthData = { activeCalories, steps };
          } catch (e) {
            console.error('HealthKitデータ取得エラー:', e);
            // HealthKitのエラーは無視して続行（オフライン時など）
          }
        }

        if (isMounted) {
          // 新しいサマリーを生成
          const newSummary = CalorieUtils.calculateDailySummary(
            date,
            dayMeals,
            dayWorkouts,
            dayBodyRecord,
            healthData
          );
          setSummary(newSummary);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : '不明なエラー');
          console.error('Daily summary error:', e);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDailySummary();

    return () => {
      isMounted = false;
    };
  }, [date, isAuthorized, getActiveCalories, getSteps, fetchStoredData, filterByDate]);

  return { summary, loading, error, isLoading };
}; 