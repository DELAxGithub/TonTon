import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TodayBalanceProps {
  data: {
    intake: number;
    burned: number;
    net: number;
  };
}

export const TodayBalance: React.FC<TodayBalanceProps> = ({ data }) => {
  const progressPercent = Math.abs(data.net) / 2000; // 2000kcalを最大値と仮定

  return (
    <View style={styles.container}>
      <Text style={styles.title}>本日の暫定収支</Text>
      
      {/* カロリー表示 */}
      <View style={styles.balanceContainer}>
        <View style={styles.calorieBox}>
          <Text style={styles.label}>摂取</Text>
          <Text style={styles.value}>{data.intake}</Text>
          <Text style={styles.unit}>kcal</Text>
        </View>
        
        <View style={styles.calorieBox}>
          <Text style={styles.label}>消費</Text>
          <Text style={styles.value}>{data.burned}</Text>
          <Text style={styles.unit}>kcal</Text>
        </View>
      </View>

      {/* 収支表示 */}
      <View style={styles.netContainer}>
        <Text style={styles.netLabel}>
          収支: {data.net > 0 ? '+' : ''}{data.net} kcal
        </Text>
        
        {/* プログレスバー */}
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar,
              { 
                width: `${progressPercent * 100}%`,
                backgroundColor: data.net > 0 ? '#4CAF50' : '#f4511e',
              },
            ]} 
          />
        </View>
        
        <Text style={styles.note}>※24時に確定します</Text>
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
    marginBottom: 16,
    color: '#333333',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  calorieBox: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    minWidth: 120,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  unit: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  netContainer: {
    alignItems: 'center',
  },
  netLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  note: {
    fontSize: 12,
    color: '#666666',
  },
});

export default TodayBalance; 