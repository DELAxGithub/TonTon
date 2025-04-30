import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const TEST_IMAGES = {
  burger: require('../assets/images/test-burger.jpg'),
  salad: require('../assets/images/test-salad.jpg'),
  sushi: require('../assets/images/test-sushi.jpg'),
};

export const ImagePicker = ({ onImageSelected }) => {
  const handleSelectImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
      });

      if (result.assets?.[0]?.uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('画像選択エラー:', error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.7,
      });

      if (result.assets?.[0]?.uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('写真撮影エラー:', error);
    }
  };

  const handleTestImage = (key: keyof typeof TEST_IMAGES) => {
    if (__DEV__) {
      const image = TEST_IMAGES[key];
      onImageSelected(Image.resolveAssetSource(image).uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
        <Text style={styles.buttonText}>写真を撮影</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
        <Text style={styles.buttonText}>写真を選択</Text>
      </TouchableOpacity>

      {__DEV__ && (
        <View style={styles.testContainer}>
          <Text style={styles.testTitle}>テスト用画像:</Text>
          <View style={styles.testButtons}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTestImage('burger')}
            >
              <Text style={styles.testButtonText}>ハンバーガー</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTestImage('salad')}
            >
              <Text style={styles.testButtonText}>サラダ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTestImage('sushi')}
            >
              <Text style={styles.testButtonText}>寿司</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  testContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  testButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  testButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
}); 