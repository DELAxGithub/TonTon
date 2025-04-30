import { verifyDailySummaryCalculation, verifyAIAdviceGeneration } from '../src/tests/phase3Verification';

async function runVerification() {
  console.log('🚀 TonTon フェーズ3 検証開始');
  console.log('----------------------------');

  // 1. 日次サマリー検証
  console.log('\n📊 日次サマリー計算検証');
  const summaryResults = verifyDailySummaryCalculation();
  
  console.log('\n検証結果:');
  console.log('✓ カロリー計算:', summaryResults.isCalorieCalculationCorrect ? '正常' : '異常');
  console.log('✓ PFCデータ:', summaryResults.isPFCDataCorrect ? '正常' : '異常');
  console.log('✓ 体組成データ:', summaryResults.isBodyDataCorrect ? '正常' : '異常');

  // 2. AIアドバイス検証
  console.log('\n🤖 AIアドバイス生成検証');
  try {
    const adviceResults = await verifyAIAdviceGeneration();
    if (!adviceResults) {
      console.log('❌ アドバイス生成に失敗しました');
      return;
    }
    
    if ('error' in adviceResults) {
      console.log('❌ エラー発生:', adviceResults.error);
    } else {
      console.log('\n検証結果:');
      console.log('✓ アドバイス生成:', adviceResults.isAdviceGenerated ? '成功' : '失敗');
      console.log('✓ 文字数制限(300文字以内):', adviceResults.isAdviceLengthValid ? '適合' : '超過');
      console.log('✓ 食事分析データ:', adviceResults.hasMealAnalysis ? '含む' : '欠落');
    }
  } catch (error) {
    console.error('❌ 検証中にエラーが発生:', error);
  }

  console.log('\n----------------------------');
  console.log('🏁 検証完了');
}

runVerification().catch(error => {
  console.error('❌ 致命的なエラーが発生:', error);
  process.exit(1);
}); 