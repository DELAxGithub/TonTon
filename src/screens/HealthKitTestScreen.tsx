import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Button, StyleSheet } from 'react-native';
import * as HealthKit from '@kingstinct/react-native-healthkit';
import { Logger } from '../utils/logger';

const TAG = 'HealthKitTestScreen';

const HealthKitTestScreen: React.FC = () => {
  const [status, setStatus] = useState('HealthKit: 初期化中...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeHealthKit = async () => {
      try {
        Logger.info(TAG, 'HealthKit 初期化開始');
        
        // HealthKitが利用可能か確認
        const isAvailable = await HealthKit.isHealthDataAvailable();
        
        if (!isAvailable) {
          throw new Error('HealthKitは利用できません');
        }
        
        // 権限リクエストを試みる
        const authStatus = await HealthKit.requestAuthorization({
          read: ['Steps', 'ActiveEnergyBurned', 'Weight', 'BodyFatPercentage'],
          write: [] // 書き込み権限が必要な場合はここに追加
        });
        
        Logger.info(TAG, `HealthKit 権限状態: ${JSON.stringify(authStatus)}`);
        
        setStatus('HealthKit: 初期化完了');
      } catch (e) {
        Logger.error(TAG, `HealthKit 初期化エラー: ${e}`);
        setError(e instanceof Error ? e.message : String(e));
        setStatus('HealthKit: 初期化失敗');
      }
    };

    initializeHealthKit();
  }, []);

  const getStepsData = async () => {
    try {
      setStatus('歩数データ取得中...');
      
      const today = new Date();
      const startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      
      // queryQuantitySamplesを使用してデータを取得
      const stepsData = await HealthKit.queryQuantitySamples({
        type: 'StepCount',
        startDate,
        endDate: today
      });
      
      // 結果の集計
      let totalSteps = 0;
      if (Array.isArray(stepsData) && stepsData.length > 0) {
        totalSteps = stepsData.reduce((sum, sample) => sum + (sample.quantity || 0), 0);
      }
      
      Logger.info(TAG, `取得した歩数: ${totalSteps}`);
      setStatus(`今日の歩数: ${totalSteps} 歩`);
    } catch (e) {
      Logger.error(TAG, `歩数データ取得エラー: ${e}`);
      setError(e instanceof Error ? e.message : String(e));
      setStatus('歩数データ取得失敗');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>HealthKit テスト</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{status}</Text>
        {error && <Text style={styles.errorText}>エラー: {error}</Text>}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="今日の歩数を取得" 
          onPress={getStepsData} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  statusContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default HealthKitTestScreen;