export type ImplementationStatus = {
  feature: string;
  status: 'completed' | 'in-progress' | 'pending';
  version: string;
  testStatus: 'passed' | 'pending' | 'failed';
  dependencies: string[];
  lastUpdated: string;
  notes?: string;
};

export const PHASE3_STATUS: ImplementationStatus[] = [
  {
    feature: 'HealthKit連携基盤',
    status: 'completed',
    version: '3.0.0',
    testStatus: 'passed',
    dependencies: ['WorkoutRecord', 'BodyRecord'],
    lastUpdated: '2024-04-26',
    notes: 'データ取得・同期処理完了'
  },
  {
    feature: 'OpenAI APIキー管理・食事写真分析',
    status: 'completed',
    version: '3.0.0',
    testStatus: 'passed',
    dependencies: [],
    lastUpdated: '2024-04-26',
    notes: 'MVPから継続利用中'
  },
  {
    feature: 'カロリー収支アドバイス生成',
    status: 'in-progress',
    version: '3.0.0-beta.1',
    testStatus: 'pending',
    dependencies: ['DailySummary'],
    lastUpdated: '2024-04-26',
    notes: 'プロンプト最適化中'
  },
  {
    feature: 'UI/UXアドバイスカード',
    status: 'in-progress',
    version: '3.0.0-beta.1',
    testStatus: 'pending',
    dependencies: ['カロリー収支アドバイス生成'],
    lastUpdated: '2024-04-26',
    notes: 'デザイン実装中'
  },
  {
    feature: 'エラーハンドリング強化',
    status: 'pending',
    version: '3.0.0-beta.2',
    testStatus: 'pending',
    dependencies: ['HealthKit連携基盤', 'OpenAI APIキー管理・食事写真分析'],
    lastUpdated: '2024-04-26',
    notes: '優先度：中'
  },
  {
    feature: 'パフォーマンス最適化',
    status: 'pending',
    version: '3.0.0-rc.1',
    testStatus: 'pending',
    dependencies: [],
    lastUpdated: '2024-04-26',
    notes: '優先度：低'
  }
]; 