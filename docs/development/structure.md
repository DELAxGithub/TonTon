# TonTon プロジェクト構造

## 最終更新
- 日時: 2024-04-29
- 更新者: Claude
- ステータス: Active

## プロジェクト概要

TonTonは、「カロリー貯金」という独自の概念を中心とした健康管理アプリケーションです。
React Native + TypeScriptで実装され、iOS/Android両プラットフォームに対応しています。

## ディレクトリ構造

```
src/
├── components/     # 再利用可能なUIコンポーネント
├── screens/       # 画面コンポーネント
├── storage/       # データ永続化
├── utils/         # ユーティリティ関数
├── navigation/    # ナビゲーション関連
├── types/         # TypeScript型定義
├── hooks/         # カスタムフック
├── services/      # APIクライアント等のサービス
├── assets/        # 画像等の静的リソース
└── tests/         # テストコード
```

## 主要コンポーネント

### データ層
- `storage/`: MMKVを使用したローカルストレージ
  - `energyStorage.ts`: カロリー貯金関連のデータ管理
  - `healthKit.ts`: HealthKit連携
  - `storage.ts`: 共通ストレージ機能

### ビジネスロジック層
- `services/`: 外部サービス連携
  - `healthkit.ts`: HealthKit APIクライアント
- `utils/`: ユーティリティ関数
  - `calorie.ts`: カロリー計算ロジック

### プレゼンテーション層
- `screens/`: 画面コンポーネント
- `components/`: 再利用可能なUI部品
- `navigation/`: 画面遷移管理

## 依存関係管理

### パッケージマネージャー
- npm/yarn（主要な依存管理）
- Bun（パフォーマンス最適化用）
- CocoaPods（iOSネイティブライブラリ管理）

### 主要な外部依存
- React Native v0.79.1
- react-native-mmkv
- react-native-health
- @react-navigation/native

## コードレビュー優先順位

### 1. ビジネスロジック層（最高優先度）
- `src/storage/energyStorage.ts`
- `src/storage/healthKit.ts`
- `src/services/healthkit.ts`
- `src/storage/EnergyRecordStorage.ts`

### 2. データ取得部分（高優先度）
- `src/storage/storage.ts`
- `src/storage/mmkv.ts`
- `src/storage/healthStorage.ts`

### 3. 画面層（中優先度）
- `src/screens/`配下の全ファイル
- `src/components/`配下の主要コンポーネント

### 4. ユーティリティ系（低優先度）
- `src/utils/`配下のファイル
- `src/hooks/`配下のファイル
- `src/types/`配下のファイル

## 関連ドキュメント
- [プロジェクト仕様書](../SPEC.md)
- [開発フロー](./flow.md)
- [実装ガイドライン](./guidelines/implementation.md) 