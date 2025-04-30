import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailySummary } from '../types/records';

interface Props {
  summary: DailySummary | null;
}

export const DailySummaryCard: React.FC<Props> = ({ summary }) => {
  if (!summary) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>本日のサマリー</Text>
        <Text style={styles.placeholder}>データがまだありません</Text>
      </View>
    );
  }

  const { totalIntakeCalories, totalEnergyBurned, netCalories } = summary;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>本日のサマリー</Text>

      <View style={styles.row}>
        <Text style={styles.label}>摂取カロリー:</Text>
        <Text style={styles.value}>{totalIntakeCalories} kcal</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>消費カロリー:</Text>
        <Text style={styles.value}>{totalEnergyBurned} kcal</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>カロリー収支:</Text>
        <Text style={[styles.value, netCalories >= 0 ? styles.plus : styles.minus]}>
          {netCalories >= 0 ? `+${netCalories}` : netCalories} kcal
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  plus: {
    color: '#4CAF50',
  },
  minus: {
    color: '#f44336',
  },
}); 