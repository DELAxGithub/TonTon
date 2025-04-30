# TonTon アプリ開発フロー

## 1. 開発環境の使い分け

### 1.1 Metroサーバーによる開発 (基本)

基本的な開発作業は、Metroサーバーを使用します。

```bash
# メインのターミナルでMetroサーバーを起動
npm run start

# 別ターミナルでアプリを起動
npm run ios  # iOSの場合
npm run android  # Androidの場合
```

#### メリット
- ホットリロードによる即時の変更反映
- リアルタイムのエラー表示（コンソール＆アプリ内）
- クロスプラットフォーム対応
- 開発サイクルの高速化

### 1.2 Xcodeによる開発

以下のケースではXcodeを使用します：

1. ネイティブ機能（HealthKitなど）のデバッグ
2. デバイス固有の問題調査
3. パフォーマンス分析
4. 実機デバッグでの詳細情報取得

```bash
# Xcodeプロジェクトを開く
open ios/TonTon.xcworkspace
```

### 1.3 ハイブリッド開発フロー

複雑な機能開発時は、両方のツールを併用します：

1. Metroサーバーを起動したまま
2. Xcodeでビルド＆実行
3. JSコードの変更はMetroで即時反映
4. ネイティブログはXcodeで確認

## 2. デバッグ戦略

### 2.1 ログ設計

```typescript
// 推奨されるログフォーマット
console.log('[機能名] アクション内容');
console.error('[機能名] エラー内容:', error);

// 例：HealthKit
console.log('[HealthKit] 初期化開始');
try {
  await initializeHealthKit();
  console.log('[HealthKit] 初期化成功');
} catch (error) {
  console.error('[HealthKit] 初期化エラー:', error);
}
```

### 2.2 デバッグツール

1. **React Native Debugger**
   - React DevTools統合
   - Redux DevTools統合
   - ネットワークモニタリング

2. **Flipper**
   - レイアウトインスペクション
   - ネットワークモニタリング
   - ストレージ監視
   - クラッシュレポート

### 2.3 ネイティブ機能のデバッグフロー

1. 準備
   - Metroサーバー起動
   - Xcodeプロジェクト準備

2. 開発サイクル
   ```mermaid
   graph TD
   A[JSコード修正] --> B[Metro反映確認]
   B --> C{動作確認}
   C -->|OK| D[次の機能へ]
   C -->|NG| E[Xcodeでネイティブログ確認]
   E --> F[問題特定]
   F --> A
   ```

## 3. 効率化のためのプラクティス

### 3.1 開発時の確認項目

- [ ] Metroサーバーが正常に動作しているか
- [ ] ホットリロードが機能しているか
- [ ] コンソールにエラーが出ていないか
- [ ] 実機での動作確認が必要な機能か

### 3.2 トラブルシューティング手順

1. Metroサーバーの再起動
   ```bash
   # キャッシュクリア付き再起動
   npm start -- --reset-cache
   ```

2. ビルドのクリーンアップ
   ```bash
   # iOSの場合
   cd ios && pod install && cd ..
   ```

3. 完全クリーンアップ
   ```bash
   watchman watch-del-all
   rm -rf node_modules
   npm install
   cd ios && pod install && cd ..
   ```

## 4. コミットメントと品質管理

1. 各機能の実装前に
   - 必要なデバッグ環境の確認
   - ログ設計の検討
   - テスト方針の決定

2. 実装中
   - 適切なログ出力
   - 段階的な動作確認
   - 早期のバグ発見

3. 実装後
   - 実機での動作確認
   - パフォーマンス確認
   - ログの妥当性確認 