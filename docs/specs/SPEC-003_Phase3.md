= SPEC-003: TonTon Phase3 正式版仕様
:sectnums:
:toc:

== Background

TonTonアプリは、ユーザー自身（開発者本人）による日常的な健康管理を目的に開発されたiOSアプリケーションである。
フェーズ1・2で、食事記録・運動記録・目標設定・HealthKit連携の基本基盤を構築済みであり、現在フェーズ3にてOpenAI連携によるAIアドバイス機能、食事写真分析機能を拡充中である。

フェーズ3のゴールは、食事・運動データを基にしたカロリー収支分析と、ユーザーへのパーソナライズドアドバイスの生成を安定稼働させることである。

ターゲットユーザーは開発者本人であり、最初は小規模なローカル利用を前提とし、スケールアウトは後続フェーズで検討する。

== Requirements

フェーズ3の要件は以下の通り、MoSCoW法に従って分類する。

=== MUST
- HealthKitから以下データを自動取得できる
  - アクティブカロリー
  - 総消費カロリー（基礎代謝込み）
  - 体重
  - 体脂肪率
- 運動記録（WorkoutRecordスキーマ）とHealthKitデータを連携・記録できる
- 日次サマリー（DailySummaryスキーマ）を正しく計算・保存できる
- OpenAI APIを使用して、カロリー収支や食事データに基づくアドバイスを生成できる
- 食事写真を分析し、内容と推定カロリーを抽出できる
- ユーザーに分かりやすい形でアドバイスを表示できる
- エラーハンドリング（APIキー未設定、ネットワークエラー、レスポンス不正）を実装する

=== SHOULD
- アドバイス生成はコスト最適化（例：タップ式で生成、毎日自動ではない）
- 食事分析プロンプトを最適化して精度を高める
- エッジケース対応（例：写真に複数食事が映っている場合など）
- UI/UX改善
  - ローディング、エラーメッセージ、分析結果の表示速度向上
  - カロリー貯金の視覚化は一時的に簡素化（テキスト表示のみ）
  - フェーズ3完了後、デザイナーと協力してUI/UX全体を改善予定

=== COULD
- ユーザーフィードバック機能（分析結果に対する正誤入力）を実装する
- 分析結果キャッシュによるOpenAIリクエスト数削減

=== WON'T
- SNS共有や通知機能はまだ導入しない
- 詳細な栄養管理（PFCバランス分析、栄養素アドバイス）はフェーズ4以降に持ち越す

== Method

フェーズ3では、既存のTonTonアプリ基盤に以下の拡張を加え、AI連携強化とデータ連動を行う。

=== システム構成

- フロントエンドのみ（バックエンド不要）
- React Native (v0.79.1)
- HealthKit連携 (react-native-health)
- OpenAI API呼び出し (fetchベース)
- ストレージ：react-native-mmkv

=== 機能詳細

==== HealthKit連携
- アプリ起動時、または手動同期ボタン押下時に以下を実施
  - 【前日分】のアクティブカロリー、総消費カロリー、体重、体脂肪率を取得
  - 【当日分】の最新ワークアウトデータ（運動時間・消費カロリー）を取得
- 失敗時リトライなし、手動リフレッシュ機能提供
- データは`WorkoutRecord`および`BodyRecord`スキーマに基づき保存
- 日次で`DailySummary`を生成・更新

==== OpenAI連携
- 食事記録・運動記録・収支データを入力として、パーソナライズドアドバイスを生成
- プロンプト最適化
  - 食事写真分析専用プロンプト
  - カロリー収支アドバイス専用プロンプト
- エラー発生時は「本日のアドバイスは準備中です」と表示
- 毎日自動生成ではなく、ユーザー操作（タップ）によるオンデマンド生成

==== データ構造
[plantuml]
----
@startuml
entity "MealRecord" {
  id: string
  date: string
  estimatedCalories: number
  proteinGrams: number
  fatGrams: number
  carbGrams: number
  memo: string
  mealType: string
}

entity "WorkoutRecord" {
  id: string
  date: string
  workoutType: string
  activeCaloriesBurned: number
  totalCaloriesBurned: number
  durationMinutes: number
  source: string
}

entity "BodyRecord" {
  id: string
  date: string
  weightKg: number
  bodyFatPercentage: number
}

entity "DailySummary" {
  date: string
  totalIntakeCalories: number
  totalEnergyBurned: number
  netCalories: number
  bodyWeight: number
}

MealRecord --> DailySummary
WorkoutRecord --> DailySummary
BodyRecord --> DailySummary
@enduml
----

=== 画面構成
- ホーム画面に「本日のアドバイス」セクション追加
- アドバイスカードはタップで更新可能
- データ取得中はローディングスピナー表示
- エラー発生時はエラーメッセージ表示（リトライ可能）

=== 技術メモ
- HealthKitからの取得後、データ不整合が起きた場合は無視して次回同期に期待する
- OpenAI APIのレート制限（1リクエスト/5秒以内）を守る
- データ保存時、日付キー（YYYY-MM-DD）単位で整合性管理

== Implementation

フェーズ3における実装ステップは以下とする。

=== HealthKit連携拡張
- `useHealthKit.ts`の修正
- ワークアウトデータ保存と日次サマリー作成

=== OpenAI連携
- `useAIAdvice.ts`作成
- タップ式APIリクエスト実装
- 成功/失敗時の分岐処理

=== UI拡張
- `HomeScreen`にアドバイスセクション追加
- 更新ボタン/エラーハンドリング

=== データ構造整理
- `DailySummary`生成ロジック整備
- 正確なカロリー収支計算

=== その他
- OpenAI APIエラー対策
- レスポンス形式チェック強化

== Milestones

. HealthKit連携拡張
. OpenAI連携機能実装
. ホーム画面改修
. 日次サマリー作成機能実装
. QAフェーズ（実機テスト・生成品質チェック）
. TestFlight公開準備
