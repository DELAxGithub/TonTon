import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CalorieUtils } from '../utils/calorie';
import { HealthKitUtils } from '../utils/healthkit';

const AddWorkoutScreen = () => {
  const navigation = useNavigation();
  const [calories, setCalories] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHealthKitAvailable, setIsHealthKitAvailable] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      initializeHealthKit();
    }
  }, []);

  const initializeHealthKit = async () => {
    const available = await HealthKitUtils.initialize();
    setIsHealthKitAvailable(available);
  };

  const handleSyncWorkouts = async () => {
    if (!isHealthKitAvailable) {
      Alert.alert('エラー', 'HealthKitが利用できません');
      return;
    }

    setIsSyncing(true);
    try {
      await HealthKitUtils.syncTodayWorkouts();
      navigation.goBack();
    } catch (error) {
      Alert.alert('エラー', '運動データの同期に失敗しました');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    if (!calories || !type || !duration) {
      Alert.alert('エラー', 'すべての項目を入力してください');
      return;
    }

    const caloriesNum = parseInt(calories, 10);
    const durationNum = parseInt(duration, 10);

    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      Alert.alert('エラー', '有効なカロリー値を入力してください');
      return;
    }

    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('エラー', '有効な時間を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      console.log('運動データを保存します:', {
        calories: caloriesNum,
        type,
        duration: durationNum,
      });
      
      await CalorieUtils.addWorkout({
        calories: caloriesNum,
        type,
        duration: durationNum,
      });
      
      console.log('運動データの保存に成功しました');
      navigation.goBack();
    } catch (error) {
      console.error('運動データの保存に失敗しました:', error);
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>運動の種類</Text>
        <TextInput
          style={styles.input}
          value={type}
          onChangeText={setType}
          placeholder="例: ランニング"
          editable={!isLoading && !isSyncing}
        />

        <Text style={styles.label}>時間 (分)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="例: 30"
          editable={!isLoading && !isSyncing}
        />

        <Text style={styles.label}>消費カロリー (kcal)</Text>
        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          placeholder="例: 300"
          editable={!isLoading && !isSyncing}
        />
      </View>

      <View style={styles.buttonContainer}>
        {Platform.OS === 'ios' && isHealthKitAvailable && (
          <TouchableOpacity
            style={[
              styles.syncButton,
              isSyncing && styles.disabledButton,
            ]}
            onPress={handleSyncWorkouts}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.buttonText}>同期中...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>HealthKitから同期</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            (isLoading || isSyncing) && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={isLoading || isSyncing}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '保存中...' : '保存'}
          </Text>
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
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
  },
  syncButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export default AddWorkoutScreen; 