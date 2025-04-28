import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Storage } from '../storage/storage';
import { UserSettings } from '../types';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [apiKey, setApiKey] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const settings = Storage.getSettings();
    if (settings) {
      setApiKey(settings.openaiApiKey || '');
      setDailyGoal(settings.dailyCalorieGoal.toString());
    }
  };

  const handleSave = async () => {
    if (!dailyGoal) {
      Alert.alert('エラー', '目標カロリーを入力してください');
      return;
    }

    const dailyGoalNum = parseInt(dailyGoal, 10);
    if (isNaN(dailyGoalNum) || dailyGoalNum <= 0) {
      Alert.alert('エラー', '有効な目標カロリーを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      const settings: UserSettings = {
        openaiApiKey: apiKey || undefined,
        dailyCalorieGoal: dailyGoalNum,
      };
      Storage.saveSettings(settings);
      navigation.goBack();
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>OpenAI APIキー</Text>
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="sk-..."
                secureTextEntry
                returnKeyType="next"
                autoCapitalize="none"
              />

              <Text style={styles.label}>1日の目標カロリー (kcal)</Text>
              <TextInput
                style={styles.input}
                value={dailyGoal}
                onChangeText={setDailyGoal}
                keyboardType="numeric"
                placeholder="例: 2000"
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                isLoading && styles.disabledButton
              ]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? '保存中...' : '保存'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
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
  saveButton: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 