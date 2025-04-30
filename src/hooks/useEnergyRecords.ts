import { useState, useEffect, useCallback } from 'react';
import { EnergyRecord } from '../types/records';
import { EnergyStorage } from '../storage/EnergyStorage';

export const useEnergyRecords = (date: string) => {
  const [records, setRecords] = useState<EnergyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const dailyRecords = await EnergyStorage.getDailyEnergyRecords(date);
      setRecords(dailyRecords);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [date]);

  const saveRecord = async (record: EnergyRecord) => {
    try {
      await EnergyStorage.saveEnergyRecord(record);
      await fetchRecords();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save record'));
      throw err;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    loading,
    error,
    saveRecord,
    refreshRecords: fetchRecords,
  };
}; 