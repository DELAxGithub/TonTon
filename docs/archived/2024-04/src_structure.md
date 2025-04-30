# ソースコード構成

## ディレクトリ構造

```
src/
├── components/     # 再利用可能なコンポーネント
│   ├── common/    # 共通UIコンポーネント
│   ├── meal/      # 食事関連コンポーネント
│   └── health/    # 健康管理関連コンポーネント
│
├── screens/        # 画面コンポーネント
│   ├── Home/      # ホーム画面
│   ├── Meal/      # 食事記録画面
│   ├── Health/    # 健康管理画面
│   └── Settings/  # 設定画面
│
├── hooks/          # カスタムフック
│   ├── useHealthKit.ts    # HealthKit連携
│   ├── useAIAdvice.ts     # OpenAI連携
│   └── useHealthData.ts   # 健康データ管理
│
├── utils/          # ユーティリティ関数
│   ├── openai.ts   # OpenAI API関連
│   ├── storage.ts  # ストレージ操作
│   └── date.ts     # 日付操作
│
├── types/          # 型定義
│   ├── goal.ts     # 目標関連の型
│   ├── health.ts   # 健康データの型
│   └── records.ts  # 記録関連の型
│
└── storage/        # データ永続化
    └── mmkv.ts     # MMKVストレージ管理

```

## 主要ファイルの役割

### コンポーネント
- `components/common/`: ボタン、入力フォームなどの共通UI
- `components/meal/`: 食事記録関連のUI
- `components/health/`: 健康データ表示用UI

### 画面
- `screens/Home/`: ダッシュボード、概要表示
- `screens/Meal/`: 食事記録の作成・編集
- `screens/Health/`: 健康データの表示・管理
- `screens/Settings/`: アプリ設定

### フック
- `useHealthKit.ts`: HealthKitとの連携処理
- `useAIAdvice.ts`: OpenAI APIを使用した食事分析
- `useHealthData.ts`: 健康データの管理

### ユーティリティ
- `openai.ts`: OpenAI API通信
- `storage.ts`: MMKVストレージ操作
- `date.ts`: 日付フォーマット、計算

### 型定義
- `goal.ts`: 目標設定の型定義
- `health.ts`: 健康データの型定義
- `records.ts`: 各種記録の型定義

### ストレージ
- `mmkv.ts`: MMKVを使用したデータ永続化

## コーディング規約

1. コンポーネント
   - Functional Componentを使用
   - Props型は明示的に定義
   - スタイルはコンポーネント内で定義

2. フック
   - カスタムフックは`use`プレフィックス
   - 依存配列の適切な管理
   - エラーハンドリングの実装

3. 型定義
   - インターフェースを優先使用
   - 必要に応じてユニオン型を活用
   - readonly修飾子の適切な使用

4. ファイル命名
   - コンポーネント: PascalCase
   - ユーティリティ: camelCase
   - 型定義: camelCase 