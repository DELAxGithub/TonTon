# AddMealScreen 写真入力機能 組み込み手順

## 📝 実装ステップ

### 1. 必要なインポートを追加

```tsx
import { ImageUtils } from '@/utils/image';
import { useAIAdvice } from '@/hooks/useAIAdvice';
import { Toast } from '@/components/Toast'; // トーストコンポーネントがある前提
import { format } from 'date-fns'; // 日付整形
import { useDailySummary } from '@/hooks/useDailySummary'; // 当日サマリー取得
```

### 2. `useAIAdvice`と`useDailySummary`を呼び出す

```tsx
const { generateAdviceWithImage } = useAIAdvice();
const today = format(new Date(), 'yyyy-MM-dd');
const { summary: currentDailySummary } = useDailySummary(today);
```

### 3. 画像取得ハンドラを追加

```tsx
const handleTakePhoto = async () => {
  try {
    const uri = await ImageUtils.takePhoto();
    if (uri) {
      const base64 = await ImageUtils.getBase64(uri);
      await analyzeImage(base64);
    }
  } catch (error) {
    Toast.show('写真撮影に失敗しました', Toast.LONG);
  }
};

const handleSelectPhoto = async () => {
  try {
    const uri = await ImageUtils.selectFromLibrary();
    if (uri) {
      const base64 = await ImageUtils.getBase64(uri);
      await analyzeImage(base64);
    }
  } catch (error) {
    Toast.show('写真選択に失敗しました', Toast.LONG);
  }
};
```

### 4. 画像分析ハンドラを追加

```tsx
const analyzeImage = async (base64: string) => {
  if (!currentDailySummary) {
    Toast.show('サマリーデータが取得できていません', Toast.LONG);
    return;
  }

  try {
    setLoading(true);

    const result = await generateAdviceWithImage({
      base64Image: base64,
      mealType: form.mealType,
      summary: currentDailySummary,
    });

    if (result?.mealAnalysis) {
      updateForm({
        estimatedCalories: result.mealAnalysis.estimatedCalories,
        proteinGrams: result.mealAnalysis.proteinGrams,
        fatGrams: result.mealAnalysis.fatGrams,
        carbGrams: result.mealAnalysis.carbGrams,
      });
    }

  } catch (error) {
    Toast.show('画像分析に失敗しました', Toast.LONG);
  } finally {
    setLoading(false);
  }
};
```

### 5. UIに「写真を撮る」「ライブラリから選択」ボタンを追加

```tsx
<View style={styles.photoButtonContainer}>
  <Button title="写真を撮る" onPress={handleTakePhoto} disabled={loading} />
  <Button title="ライブラリから選択" onPress={handleSelectPhoto} disabled={loading} />
</View>
```

### 📋 必要なStyle追加例

```tsx
photoButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 16,
},
```

## ✅ 実装後のフロー

1. 「写真を撮る」or「ライブラリから選択」
2. → Base64に変換
3. → OpenAIへ送信＆推定カロリー・PFCを取得
4. → 自動でフォームに反映
5. → ユーザーは微調整して保存

## 📝 実装状況の確認

現在の実装状況を確認するため、関連ファイルをチェックします：

1. `src/utils/image.ts`
2. `src/hooks/useAIAdvice.ts`
3. `src/components/Toast.tsx`
4. `src/screens/AddMealScreen.tsx` 