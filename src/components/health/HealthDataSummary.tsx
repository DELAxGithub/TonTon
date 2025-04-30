import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {DailyHealthData} from '../../types/health';

interface HealthDataSummaryProps {
  healthData: DailyHealthData | null;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

export const HealthDataSummary: React.FC<HealthDataSummaryProps> = ({
  healthData,
  isLoading,
  error,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>ヘルスデータを取得中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error.message}</Text>
        <Text style={styles.refreshText} onPress={onRefresh}>
          再試行
        </Text>
      </View>
    );
  }

  if (!healthData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.infoText}>ヘルスデータがありません</Text>
        <Text style={styles.refreshText} onPress={onRefresh}>
          データを取得
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>本日の健康データ</Text>

      <View style={styles.dataRow}>
        <Text style={styles.label}>消費カロリー:</Text>
        <Text style={styles.value}>{healthData.totalEnergyBurned.toFixed(0)} kcal</Text>
      </View>

      <View style={styles.dataRow}>
        <Text style={styles.label}>摂取カロリー:</Text>
        <Text style={styles.value}>{healthData.totalIntakeCalories.toFixed(0)} kcal</Text>
      </View>

      <View style={styles.nutritionContainer}>
        <Text style={styles.subtitle}>栄養素</Text>
        <View style={styles.dataRow}>
          <Text style={styles.label}>炭水化物:</Text>
          <Text style={styles.value}>{healthData.totalCarbGrams.toFixed(1)} g</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.label}>タンパク質:</Text>
          <Text style={styles.value}>{healthData.totalProteinGrams.toFixed(1)} g</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.label}>脂質:</Text>
          <Text style={styles.value}>{healthData.totalFatGrams.toFixed(1)} g</Text>
        </View>
      </View>

      <Text style={styles.updatedText}>
        最終更新: {new Date().toLocaleTimeString()}
      </Text>

      <Text style={styles.refreshText} onPress={onRefresh}>
        データを更新
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  errorContainer: {
    backgroundColor: '#fff0f0',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  nutritionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  infoText: {
    color: '#555',
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 8,
    color: '#555',
  },
  refreshText: {
    color: 'blue',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  updatedText: {
    fontSize: 12,
    color: '#888',
    marginTop: 12,
    textAlign: 'right',
  },
}); 