import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'ton-ton-storage',
  encryptionKey: 'ton-ton-secret-key'
});

export const STORAGE_KEYS = {
  MEALS: 'meals',
  WORKOUTS: 'workouts',
  DAILY_SUMMARIES: 'daily-summaries',
  USER_SETTINGS: 'user-settings',
} as const; 