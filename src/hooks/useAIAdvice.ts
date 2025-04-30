import { useState } from 'react';
import { STORAGE_KEYS, getEntry, updateEntry } from '../storage/mmkv';
import { DailySummary, MealRecord, MealAnalysisResult, AIAdviceResult, MEAL_TYPES } from '../types/records';
import OpenAI from 'openai';
import { Storage } from '../storage/storage';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

declare const __DEV__: boolean;

type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: { url: string };
  }[];
};

// 型定義の追加
interface AnalysisResponse {
  mealAnalysis?: MealAnalysisResult;
  advice: string;
}

const parseAnalysisResponse = (content: string): AnalysisResponse => {
  let mealAnalysis: MealAnalysisResult | undefined;
  let advice = content;

  try {
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      mealAnalysis = JSON.parse(jsonMatch[0]);
      advice = content.replace(jsonMatch[0], '').trim();
    }
  } catch (e) {
    console.warn('食事分析のJSONパースに失敗:', e);
  }

  return { mealAnalysis, advice };
};

const createHealthDataPrompt = (summary: DailySummary): string => {
  return `
以下の健康データを分析し、具体的なアドバイスを提供してください：

【基本データ】
- 体重: ${summary.bodyWeight ? `${summary.bodyWeight}kg` : '記録なし'}
- 体脂肪率: ${summary.bodyFatPercentage ? `${summary.bodyFatPercentage}%` : '記録なし'}

【活動データ】
- 運動時間: ${summary.exerciseMinutes || 0}分
- 消費カロリー: ${summary.activeEnergyBurned || 0}kcal（活動）+ ${summary.basalEnergyBurned || 0}kcal（基礎代謝）

【評価ポイント】
1. 活動量は適切か
2. カロリー収支のバランスは取れているか
3. 体組成の変化は健康的か
4. 生活習慣の改善点

実行可能で具体的な提案を300文字程度でお願いします。`;
};

interface MealAnalysis {
  estimatedCalories: number;
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
}

interface GenerateAdviceWithImageParams {
  base64Image: string;
  mealType: string;
  summary: DailySummary;
}

interface GenerateAdviceResult {
  mealAnalysis?: MealAnalysisResult;
  advice: string;
}

export const useAIAdvice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOpenAIClient = () => {
    const apiKey = Storage.getOpenAIKey();
    if (!apiKey) {
      throw new Error('OpenAI APIキーが設定されていません');
    }
    return new OpenAI({ apiKey });
  };

  const generateAdviceWithImage = async ({
    base64Image,
    mealType,
    summary,
  }: GenerateAdviceWithImageParams): Promise<GenerateAdviceResult> => {
    setLoading(true);
    setError(null);

    try {
      // 開発時はダミーデータを返す
      if (__DEV__) {
        return {
          mealAnalysis: {
            estimatedCalories: 650,
            proteinGrams: 28,
            fatGrams: 35,
            carbGrams: 45
          },
          advice: `このハンバーガーは約650kcalと推定されます。
主なポイント：
- タンパク質が豊富で良好です（28g）
- 脂質がやや高めです（35g）
- 炭水化物は適度です（45g）

1日の残りの食事では、野菜を多めに摂取することをお勧めします。また、夕食は軽めにすることで、1日のカロリーバランスを整えられます。`
        };
      }

      const openai = getOpenAIClient();

      const systemPrompt = `あなたは栄養士のアシスタントです。送信された食事の写真を分析し、以下の情報を提供してください：
1. 推定カロリー
2. タンパク質（g）
3. 脂質（g）
4. 炭水化物（g）

また、現在の1日の摂取状況も考慮して、アドバイスを提供してください。
レスポンスは以下のJSON形式で返してください：

{
  "mealAnalysis": {
    "estimatedCalories": number,
    "proteinGrams": number,
    "fatGrams": number,
    "carbGrams": number
  },
  "advice": string
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
              {
                type: 'text',
                text: `この${mealType}の写真を分析してください。\n\n現在の1日の状況：\n- 摂取カロリー: ${summary?.totalIntakeCalories ?? 0}kcal\n- 消費カロリー: ${summary?.totalEnergyBurned ?? 0}kcal\n- タンパク質: ${summary?.totalProteinGrams ?? 0}g\n- 脂質: ${summary?.totalFatGrams ?? 0}g\n- 炭水化物: ${summary?.totalCarbGrams ?? 0}g`,
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;

    } catch (error) {
      console.error('AI分析エラー:', error);
      setError('AI分析に失敗しました');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLastAdvice = (): AIAdviceResult | null => {
    return getEntry(STORAGE_KEYS.LAST_ADVICE);
  };

  return {
    loading,
    error,
    generateAdviceWithImage,
    getLastAdvice,
  };
}; 