import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/types';
import { DailySummary } from '../types';
import { CalorieUtils } from '../utils/calorie';

const HomeScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [summary, setSummary] = useState<DailySummary | null>(null);

  const loadDailySummary = async () => {
    const today = CalorieUtils.getDateString();
    const updatedSummary = await CalorieUtils.updateDailySummary(today);
    setSummary(updatedSummary);
  };

  // 画面がフォーカスされるたびにデータを更新
  useFocusEffect(
    React.useCallback(() => {
      loadDailySummary();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>今日の貯金</Text>
        <Text style={styles.balanceAmount}>
          {summary ? `${summary.balance} kcal` : '0 kcal'}
        </Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            摂取: {summary?.totalIntakeCalories || 0} kcal
          </Text>
          <Text style={styles.detailText}>
            消費: {summary?.totalBurnedCalories || 0} kcal
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddMeal')}
        >
          <Text style={styles.buttonText}>食事を記録</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddWorkout')}
        >
          <Text style={styles.buttonText}>運動を記録</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>設定</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  balanceTitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  detailsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: '#666',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 