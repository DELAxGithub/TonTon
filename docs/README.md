# TonTon プロジェクトドキュメント

## ディレクトリ構造

```
docs/
├── README.md                # このファイル
├── SPEC.md                 # プロジェクト仕様書
├── development/            # 開発関連ドキュメント
│   ├── rules.md           # 開発ルール
│   ├── flow.md           # 開発フロー
│   └── structure.md      # ソース構造
├── implementation/        # 実装詳細ドキュメント
│   └── features/         # 機能別実装ドキュメント
└── progress/            # 進捗管理
    ├── current.md       # 現在の進捗状況
    └── todo.md         # TODOリスト

## ドキュメント概要

### 仕様書
- `SPEC.md`: プロジェクトの詳細仕様を記載

### 開発ドキュメント
- `development/rules.md`: プロジェクトの開発ルール
- `development/flow.md`: 開発フローの説明
- `development/structure.md`: ソースコードの構造と依存関係

### 実装ドキュメント
- `implementation/features/`: 各機能の実装詳細を記載

### 進捗管理
- `progress/current.md`: 現在の開発進捗状況
- `progress/todo.md`: 今後のTODOリスト

## ドキュメント管理ルール

1. すべての新規ドキュメントは適切なディレクトリに配置する
2. ドキュメントの更新は必ずGitで管理する
3. 重要な変更は必ずPRでレビューを受ける
4. 古くなったドキュメントは適切にアーカイブまたは削除する

## プロジェクト概要

TonTonは、ユーザーの健康管理をサポートするiOSアプリケーションです。食事記録、運動記録、体重管理などの機能を提供し、HealthKitとの連携やAIによる食事分析機能を実装しています。

## 技術スタック

- **フレームワーク**: React Native (v0.79.1)
- **状態管理**: React Hooks
- **ストレージ**: react-native-mmkv
- **外部API**: OpenAI API (GPT-4)
- **ヘルスケア連携**: HealthKit (react-native-health)
- **画像処理**: react-native-image-picker
- **ナビゲーション**: @react-navigation/native

## セットアップ手順

1. 依存関係のインストール:
```bash
npm install
```

2. 環境変数の設定:
- `.env`ファイルを作成し、必要な環境変数を設定
- OpenAI APIキーの設定（詳細は`settings.md`参照）

3. iOSビルド準備:
```bash
cd ios
pod install
cd ..
```

4. 開発サーバーの起動:
```bash
npm run start
```

5. アプリケーションの起動:
```bash
# iOS
npm run ios

# Android
npm run android
```

## デバッグ方法

### iOS
- Xcodeでデバッグログの確認
- React Native Debuggerの使用
- HealthKit関連のデバッグは実機での動作確認が必要

### Android
- Android Studioでのデバッグ
- adbログの確認

## 実装フェーズ

### Phase 1 ✅
- 基本的なUI実装
- MMKVストレージセットアップ
- 食事記録の基本機能

### Phase 2 ✅
- HealthKit連携
- 運動記録機能
- 目標設定機能

### Phase 3 🚧
- OpenAI API連携
- 食事写真分析
- 詳細な栄養管理

### Phase 4 (未着手)
- ソーシャル機能
- データ分析・可視化強化
- プッシュ通知

## 次のステップ

1. Phase 3の完了
   - 食事写真分析の精度向上
   - 栄養バランス分析の実装
   - ユーザーフィードバック対応

2. Phase 4の準備
   - ソーシャル機能の設計
   - データ分析機能の詳細設計
   - プッシュ通知の実装計画 