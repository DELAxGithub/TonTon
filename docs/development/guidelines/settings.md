# 設定情報とAPIキー管理

## OpenAI API設定

### APIキーの管理
APIキーはMMKVストレージで管理されています。

```typescript
// src/utils/openai.ts
static async getApiKey(): Promise<string> {
  const settings = Storage.getSettings();
  if (!settings?.openaiApiKey) {
    throw new Error('OpenAI APIキーが設定されていません');
  }
  return settings.openaiApiKey;
}
```

### 環境変数設定
開発時は`.env`ファイルに以下の変数を設定してください：

```plaintext
OPENAI_API_KEY=your_api_key_here
```

## HealthKit設定

### 必要な権限
以下の権限が`ios/TonTon/Info.plist`に設定されています：

```xml
<key>NSHealthShareUsageDescription</key>
<string>運動データとカロリー消費を記録するためにHealthKitを使用します</string>
<key>NSHealthUpdateUsageDescription</key>
<string>運動記録を保存するためにHealthKitを使用します</string>
```

### HealthKit初期化
`src/hooks/useHealthKit.ts`で以下の権限を要求：

- Steps (歩数)
- ActiveEnergyBurned (消費カロリー)
- AppleExerciseTime (運動時間)

## MMKVストレージ

### ストレージキー
`src/storage/mmkv.ts`で定義：

```typescript
export const STORAGE_KEYS = {
  SETTINGS: 'settings',
  MEAL_RECORDS: 'meal_records',
  WORKOUT_RECORDS: 'workout_records',
  BODY_RECORDS: 'body_records',
  GOALS: 'goals'
};
```

### データ永続化
- すべてのデータはMMKVを使用して永続化
- 暗号化は未実装（今後の課題）

## 画像処理設定

### 必要な権限
`ios/TonTon/Info.plist`に以下の権限を設定：

```xml
<key>NSCameraUsageDescription</key>
<string>食事の写真を撮影するためにカメラを使用します</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>食事の写真を選択するためにフォトライブラリを使用します</string>
```

### 画像圧縮設定
- 画質: 0.7
- 最大サイズ: 1024x1024px 