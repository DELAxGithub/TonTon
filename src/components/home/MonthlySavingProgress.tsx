import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MonthlySavingProgressProps {
  data: {
    percent: number;
    current: number;
    goal: number;
    remaining: number;
  };
}

export const MonthlySavingProgress: React.FC<MonthlySavingProgressProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>月間カロリー貯金</Text>
      
      {/* プログレスバー */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${data.percent * 100}%` }]} />
      </View>
      
      {/* 数値表示 */}
      <View style={styles.statsContainer}>
        <Text style={styles.stats}>
          {data.current.toLocaleString()} / {data.goal.toLocaleString()} kcal
        </Text>
        <Text style={styles.remaining}>
          目標まで: {data.remaining.toLocaleString()} kcal
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#e5e5e5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f4511e',
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    fontSize: 16,
    color: '#333333',
  },
  remaining: {
    fontSize: 14,
    color: '#666666',
  },
});

export default MonthlySavingProgress; 