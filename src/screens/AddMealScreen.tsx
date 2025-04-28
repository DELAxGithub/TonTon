import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CalorieUtils } from '../utils/calorie';
import { ImageUtils } from '../utils/image';
import { OpenAIUtils } from '../utils/openai';

const AddMealScreen = () => {
  const navigation = useNavigation();
  const [calories, setCalories] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTakePhoto = async () => {
    try {
      const uri = await ImageUtils.takePhoto();
      if (uri) {
        setImageUri(uri);
        await analyzeImage(uri);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('エラー', error.message);
      } else {
        Alert.alert('エラー', '写真の撮影に失敗しました');
      }
    }
  };

  const handleSelectPhoto = async () => {
    try {
      const uri = await ImageUtils.selectFromLibrary();
      if (uri) {
        setImageUri(uri);
        await analyzeImage(uri);
      }
    } catch (error) {
      Alert.alert('エラー', '写真の選択に失敗しました');
    }
  };

  const analyzeImage = async (uri: string) => {
    try {
      const apiKey = await OpenAIUtils.getApiKey();
      if (!apiKey) {
        Alert.alert(
          'エラー',
          'OpenAI APIキーが設定されていません。設定画面から設定してください。',
          [
            {
              text: '設定画面へ',
              onPress: () => navigation.navigate('Settings' as never),
            },
            { text: 'キャンセル', style: 'cancel' },
          ],
        );
        return;
      }

      setIsAnalyzing(true);
      const result = await OpenAIUtils.analyzeImage(uri);
      if (result) {
        setCalories(result.calories.toString());
        setDescription(result.description);
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      if (error instanceof Error) {
        Alert.alert('画像分析エラー', error.message);
      } else {
        Alert.alert('エラー', '画像の分析に失敗しました');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!calories || !description) {
      Alert.alert('エラー', 'カロリーと説明を入力してください');
      return;
    }

    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      Alert.alert('エラー', '有効なカロリー値を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      await CalorieUtils.addMeal({
        calories: caloriesNum,
        description,
        imageUrl: imageUri || undefined,
        timestamp: Date.now(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>写真を追加</Text>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.photoButton, styles.takePhotoButton]}
                onPress={handleTakePhoto}
                disabled={isAnalyzing || isLoading}
              >
                <Text style={styles.buttonText}>写真を撮影</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.photoButton, styles.selectPhotoButton]}
                onPress={handleSelectPhoto}
                disabled={isAnalyzing || isLoading}
              >
                <Text style={styles.buttonText}>写真を選択</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>カロリー (kcal)</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                placeholder="例: 500"
                editable={!isAnalyzing && !isLoading}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <Text style={styles.label}>説明</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="例: ハンバーグ定食"
                multiline
                editable={!isAnalyzing && !isLoading}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (isLoading || isAnalyzing) && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={isLoading || isAnalyzing}
            >
              {isLoading || isAnalyzing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.buttonText}>
                    {isAnalyzing ? '分析中...' : '保存中...'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>保存</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
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
    padding: 20,
  },
  imageContainer: {
    aspectRatio: 1,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  photoButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  takePhotoButton: {
    backgroundColor: '#4CAF50',
  },
  selectPhotoButton: {
    backgroundColor: '#2196F3',
  },
  inputContainer: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export default AddMealScreen; 