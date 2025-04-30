import { useState } from 'react';
import { storage, STORAGE_KEYS } from '../storage/mmkv';
import { HealthData } from './useAIAdvice';

export const useHealthData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveHealthData = (data: HealthData) => {
    try {
      storage.set(STORAGE_KEYS.HEALTH_DATA, JSON.stringify(data));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(errorMessage);
      return false;
    }
  };

  const getHealthData = (): HealthData | null => {
    try {
      const savedData = storage.getString(STORAGE_KEYS.HEALTH_DATA);
      return savedData ? JSON.parse(savedData) : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(errorMessage);
      return null;
    }
  };

  const clearHealthData = () => {
    try {
      storage.delete(STORAGE_KEYS.HEALTH_DATA);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setError(errorMessage);
      return false;
    }
  };

  return {
    saveHealthData,
    getHealthData,
    clearHealthData,
    loading,
    error,
  };
}; 