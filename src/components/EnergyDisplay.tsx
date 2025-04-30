import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EnergyStorage } from '../storage/energyStorage';
import { EnergyRecord } from '../types/records';

type Props = {
  date: string;
};

export const EnergyDisplay: React.FC<Props> = ({ date }) => {
  const [records, setRecords] = useState<{
    active?: EnergyRecord;
    total?: EnergyRecord;
  }>({});

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const dailyRecords = await EnergyStorage.getDailyEnergyRecords(date);
        setRecords(dailyRecords);
      } catch (error) {
        console.error('エネルギー記録の取得に失敗しました:', error);
      }
    };

    loadRecords();
  }, [date]);

  return (
    <View style={styles.container}>
      <View style={styles.recordContainer}>
        <Text style={styles.label}>アクティブカロリー</Text>
        <Text style={styles.value}>
          {records.active ? `${records.active.value} kcal` : '記録なし'}
        </Text>
      </View>

      <View style={styles.recordContainer}>
        <Text style={styles.label}>総消費カロリー</Text>
        <Text style={styles.value}>
          {records.total ? `${records.total.value} kcal` : '記録なし'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
}); 