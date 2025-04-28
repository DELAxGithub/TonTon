import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

export class ImageUtils {
  private static async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'カメラへのアクセス許可',
            message: '食事の写真を撮影するためにカメラへのアクセスが必要です',
            buttonPositive: '許可する',
            buttonNegative: '許可しない',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  static async takePhoto(): Promise<string | null> {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      if (Platform.OS === 'ios') {
        Alert.alert(
          'カメラの使用が許可されていません',
          '設定アプリからカメラの使用を許可してください',
          [
            {
              text: '設定を開く',
              onPress: () => {
                Linking.openSettings();
              },
            },
            { text: 'キャンセル', style: 'cancel' },
          ],
        );
      }
      throw new Error('カメラの使用が許可されていません');
    }

    return new Promise((resolve, reject) => {
      launchCamera(
        {
          mediaType: 'photo',
          quality: 0.8,
          saveToPhotos: true,
        },
        (response: ImagePickerResponse) => {
          if (response.errorCode) {
            reject(new Error(response.errorMessage));
            return;
          }
          if (response.didCancel) {
            resolve(null);
            return;
          }
          if (response.assets && response.assets[0]?.uri) {
            resolve(response.assets[0].uri);
          } else {
            reject(new Error('写真の取得に失敗しました'));
          }
        },
      );
    });
  }

  static async selectFromLibrary(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
        },
        (response: ImagePickerResponse) => {
          if (response.errorCode) {
            reject(new Error(response.errorMessage));
            return;
          }
          if (response.didCancel) {
            resolve(null);
            return;
          }
          if (response.assets && response.assets[0]?.uri) {
            resolve(response.assets[0].uri);
          } else {
            reject(new Error('写真の取得に失敗しました'));
          }
        },
      );
    });
  }
} 