# TonTon Phase 2 仕様書

## 1. 概要

### 1.1 目的
フェーズ2では、基本的なデータ取得・連携の基盤を整備し、ユーザーが日々の活動を記録・管理できる機能を実装する。

### 1.2 スコープ
- 食事・運動記録の基本機能
- HealthKit連携の基盤
- ユーザー設定機能
- データ永続化

## 2. 機能仕様

### 2.1 ホーム画面
- カロリー収支の表示
  - 今日の貯金（収支バランス）
  - 摂取カロリー合計
  - 消費カロリー合計
- メイン機能へのナビゲーション
  - 食事記録
  - 運動記録
  - 設定

### 2.2 食事記録機能
- 写真撮影/選択機能
- 食事データの入力
  - カロリー値
  - 説明（メモ）
- データの保存・更新

### 2.3 運動記録機能
- 運動データの手動入力
  - 運動の種類
  - 実施時間（分）
  - 消費カロリー
- HealthKitとの連携（iOS）
  - 運動データの同期
  - 当日の活動データ取得

### 2.4 設定機能
- ユーザー設定の管理
  - 目標カロリーの設定
  - OpenAI APIキーの設定（Phase 3用）
- 設定の永続化

### 2.5 データ管理
- ローカルストレージによるデータ永続化
  - 食事記録
  - 運動記録
  - ユーザー設定
- 日次サマリーの計算・管理
  - カロリー収支の計算
  - 目標達成状況の追跡

## 3. 技術仕様

### 3.1 使用技術
- React Native
- AsyncStorage/MMKV
- HealthKit (iOS)
- React Navigation

### 3.2 データモデル
```typescript
// ユーザー設定
interface UserSettings {
  dailyCalorieGoal: number;
  openaiApiKey?: string;
}

// 食事記録
interface MealRecord {
  id: string;
  timestamp: number;
  calories: number;
  description: string;
  imageUri?: string;
}

// 運動記録
interface WorkoutRecord {
  id: string;
  timestamp: number;
  type: string;
  duration: number;
  calories: number;
}

// 日次サマリー
interface DailySummary {
  date: string;
  totalIntakeCalories: number;
  totalBurnedCalories: number;
  balance: number;
}
```

### 3.3 ストレージ構造
- `@tonton/settings`: ユーザー設定
- `@tonton/meals`: 食事記録
- `@tonton/workouts`: 運動記録
- `@tonton/summaries`: 日次サマリー

## 4. UI/UX仕様

### 4.1 デザインガイドライン
- プライマリーカラー: #f4511e
- セカンダリーカラー: #4CAF50
- フォントサイズ
  - タイトル: 24px
  - サブタイトル: 18px
  - 本文: 16px
- 余白
  - 画面パディング: 20px
  - 要素間マージン: 15-20px

### 4.2 画面遷移
- ホーム画面
  - → 食事記録画面
  - → 運動記録画面
  - → 設定画面

## 5. 制限事項・注意点
- HealthKit連携はiOSのみ対応
- 画像の保存は端末のローカルストレージを使用
- オフライン動作を前提とした設計

## 6. 今後の展開
- Phase 3でのAI機能追加に向けた基盤整備
- データ分析機能の拡張に備えたデータ構造の設計 