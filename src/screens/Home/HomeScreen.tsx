import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useHealthKit } from '../../hooks/useHealthKit';
import { HealthDataSummary } from '../../components/health/HealthDataSummary';
import { format } from 'date-fns';

const HomeScreen = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { isAuthorized, isLoading, error, getActiveCalories, getSteps } = useHealthKit();
  const [healthData, setHealthData] = useState({ activeCalories: 0, steps: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const refreshHealthData = useCallback(async () => {
    if (!isAuthorized) return;

    try {
      const [activeCalories, steps] = await Promise.all([
        getActiveCalories(today, today),
        getSteps(today, today)
      ]);
      setHealthData({ activeCalories, steps });
    } catch (e) {
      console.error('HealthKitデータ更新エラー:', e);
    }
  }, [isAuthorized, getActiveCalories, getSteps, today]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshHealthData();
    setRefreshing(false);
  }, [refreshHealthData]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <HealthDataSummary
        healthData={healthData}
        isLoading={isLoading}
        error={error}
        onRefresh={refreshHealthData}
      />

      {/* 他のコンポーネントをここに追加 */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default HomeScreen; 