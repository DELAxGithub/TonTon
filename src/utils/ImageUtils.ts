import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export class ImageUtils {
  static async takePhoto(): Promise<string | null> {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      saveToPhotos: false,
    });

    if (result.didCancel || !result.assets?.[0]?.uri) {
      return null;
    }

    return result.assets[0].uri;
  }

  static async selectFromLibrary(): Promise<string | null> {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    });

    if (result.didCancel || !result.assets?.[0]?.uri) {
      return null;
    }

    return result.assets[0].uri;
  }

  static async getBase64(uri: string): Promise<string> {
    // iOSとAndroidでパスの扱いが異なるため、適切に変換
    const filePath = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const base64 = await RNFS.readFile(filePath, 'base64');
    return base64;
  }
} 