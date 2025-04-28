import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WorkoutRecord } from '../types';
import { StorageUtils } from '../utils/storage';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<RootStackParamList, 'EditWorkout'>;

const EditWorkoutScreen: React.FC<Props> = ({ navigation, route }) => {
  const { workout } = route.params;
  const [calories, setCalories] = useState(workout.calories.toString());
  const [description, setDescription] = useState(workout.description);
  const [loading, setLoading] = useState(false);

  // refs for TextInputs
  const caloriesInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleCaloriesSubmit = () => {
    descriptionInputRef.current?.focus();
  };

  const handleDescriptionSubmit = () => {
    Keyboard.dismiss();
    handleSave();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const caloriesNumber = parseInt(calories, 10);
      if (isNaN(caloriesNumber) || caloriesNumber <= 0) {
        Alert.alert('エラー', 'カロリーは正の数値を入力してください');
        caloriesInputRef.current?.focus();
        return;
      }

      const updatedWorkout: WorkoutRecord = {
        ...workout,
        calories: caloriesNumber,
        description,
      };

      await StorageUtils.updateWorkout(updatedWorkout);
      Alert.alert('成功', '運動データを更新しました');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update workout:', error);
      Alert.alert('エラー', '運動データの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      '確認',
      'この運動データを削除してもよろしいですか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await StorageUtils.deleteWorkout(workout.id);
              Alert.alert('成功', '運動データを削除しました');
              navigation.goBack();
            } catch (error) {
              console.error('Failed to delete workout:', error);
              Alert.alert('エラー', '運動データの削除に失敗しました');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.label}>日時</Text>
            <Text style={styles.dateText}>
              {format(new Date(workout.timestamp), 'yyyy/MM/dd HH:mm')}
            </Text>

            <Text style={styles.label}>消費カロリー (kcal)</Text>
            <TextInput
              ref={caloriesInputRef}
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholder="消費カロリーを入力"
              editable={!loading}
              returnKeyType="next"
              onSubmitEditing={handleCaloriesSubmit}
              blurOnSubmit={false}
            />

            <Text style={styles.label}>メモ</Text>
            <TextInput
              ref={descriptionInputRef}
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="メモを入力"
              multiline
              numberOfLines={4}
              editable={!loading}
              textAlignVertical="top"
              returnKeyType="done"
              onSubmitEditing={handleDescriptionSubmit}
              blurOnSubmit={true}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.buttonText}>保存</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
                disabled={loading}
              >
                <Text style={[styles.buttonText, styles.deleteButtonText]}>削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dateText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#FF5252',
  },
});

export default EditWorkoutScreen; 