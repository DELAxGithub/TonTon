import { useState, useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';
import { Logger } from '../utils/logger';

const { HealthKitBridge } = NativeModules;
const TAG = 'useHealthKit';

export const useHealthKit = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeHealthKit = async () => {
      if (Platform.OS !== 'ios') {
        Logger.info(TAG, 'HealthKitはiOSでのみ利用可能です');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const result = await HealthKitBridge.requestAuthorization();
        Logger.info(TAG, `HealthKit認証結果: ${result}`);
        setIsAuthorized(true);
      } catch (e: any) {
        Logger.error(TAG, `HealthKit認証エラー: ${e?.message ?? e}`);
        setError(e instanceof Error ? e.message : String(e));
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeHealthKit();
  }, []);

  const getActiveCalories = async (startDate: string, endDate: string): Promise<number> => {
    if (!isAuthorized) {
      throw new Error('HealthKitが認証されていません');
    }

    try {
      const calories = await HealthKitBridge.getActiveCalories(startDate, endDate);
      Logger.info(TAG, `アクティブカロリー取得成功: ${calories}`);
      return calories;
    } catch (e: any) {
      Logger.error(TAG, `アクティブカロリー取得エラー: ${e?.message ?? e}`);
      throw e instanceof Error ? e : new Error(String(e));
    }
  };

  const getSteps = async (startDate: string, endDate: string): Promise<number> => {
    if (!isAuthorized) {
      throw new Error('HealthKitが認証されていません');
    }

    try {
      const steps = await HealthKitBridge.getSteps(startDate, endDate);
      Logger.info(TAG, `歩数取得成功: ${steps}`);
      return steps;
    } catch (e: any) {
      Logger.error(TAG, `歩数取得エラー: ${e?.message ?? e}`);
      throw e instanceof Error ? e : new Error(String(e));
    }
  };

  return {
    isAuthorized,
    isLoading,
    error,
    getActiveCalories,
    getSteps,
  };
}; 