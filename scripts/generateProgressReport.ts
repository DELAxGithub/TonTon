import { ImplementationStatus, PHASE3_STATUS } from '../src/types/implementation';

export function generateProgressReport(): string {
  const now = new Date();
  const report = {
    date: now.toISOString(),
    completedFeatures: PHASE3_STATUS.filter(f => f.status === 'completed'),
    inProgressFeatures: PHASE3_STATUS.filter(f => f.status === 'in-progress'),
    pendingFeatures: PHASE3_STATUS.filter(f => f.status === 'pending'),
    testCoverage: calculateTestCoverage(),
    nextMilestone: determineNextMilestone()
  };

  return formatReport(report);
}

function calculateTestCoverage(): number {
  const passedTests = PHASE3_STATUS.filter(f => f.testStatus === 'passed').length;
  return (passedTests / PHASE3_STATUS.length) * 100;
}

function determineNextMilestone(): string {
  const inProgress = PHASE3_STATUS.find(f => f.status === 'in-progress');
  return inProgress ? inProgress.feature : 'すべての機能が完了または未着手です';
}

function formatReport(report: any): string {
  return `
# TonTon フェーズ3 進捗レポート
生成日時: ${new Date(report.date).toLocaleString('ja-JP')}

## 📊 実装状況
完了: ${report.completedFeatures.length}件
進行中: ${report.inProgressFeatures.length}件
未着手: ${report.pendingFeatures.length}件

## ✅ 完了機能
${report.completedFeatures.map(f => `- ${f.feature} (v${f.version})`).join('\n')}

## 🚧 実装中機能
${report.inProgressFeatures.map(f => `- ${f.feature} (${f.notes})`).join('\n')}

## ⏳ 未着手機能
${report.pendingFeatures.map(f => `- ${f.feature}`).join('\n')}

## 📈 テストカバレッジ
${report.testCoverage.toFixed(1)}%

## 🎯 次のマイルストーン
${report.nextMilestone}
`;
}

// レポート生成実行
if (require.main === module) {
  console.log(generateProgressReport());
} 