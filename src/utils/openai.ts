import { Storage } from '../storage/storage';

interface OpenAIVisionResponse {
  description: string;
  calories: number;
}

interface OpenAIError {
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

export class OpenAIUtils {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly MODEL = 'gpt-4o';
  private static readonly MAX_TOKENS = 300;
  private static readonly SYSTEM_PROMPT = 
    'あなたは食事の写真から内容とカロリーを分析するアシスタントです。' +
    '写真に写っている食事の内容を簡潔に説明し、カロリーを推定してください。' +
    '必ず {"description": "食事の説明", "calories": 推定カロリー} の形式のJSONで返答してください。' +
    'カロリーは必ず数値で返してください。余計な説明は不要です。';

  static async getApiKey(): Promise<string> {
    const settings = Storage.getSettings();
    if (!settings?.openaiApiKey) {
      throw new Error('OpenAI APIキーが設定されていません');
    }
    return settings.openaiApiKey;
  }

  private static async imageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error('画像の読み込みに失敗しました');
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.includes('base64,') 
            ? base64String.split('base64,')[1]
            : base64String;
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error('Base64エンコードに失敗しました'));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Image to Base64 error:', error);
      throw new Error('画像の変換に失敗しました');
    }
  }

  static async analyzeImage(imageUri: string): Promise<OpenAIVisionResponse> {
    try {
      const apiKey = await this.getApiKey();
      const base64Image = await this.imageToBase64(imageUri);

      console.log('Sending request to OpenAI API...');
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: this.SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: '写真の食事内容とカロリーを分析してJSON形式で返してください。'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: this.MAX_TOKENS,
          temperature: 0.5,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('OpenAI API error response:', responseData);
        const errorData = responseData as OpenAIError;
        throw new Error(
          errorData.error?.message || 
          `API通信に失敗しました (${response.status}: ${response.statusText})`
        );
      }

      console.log('OpenAI API response:', responseData);
      const content = responseData.choices?.[0]?.message?.content;
      
      if (!content) {
        console.error('Invalid response format:', responseData);
        throw new Error('APIからの応答が不正です');
      }

      try {
        const parsedContent = JSON.parse(content.trim());
        if (!parsedContent.description || typeof parsedContent.calories !== 'number') {
          console.error('Invalid content format:', parsedContent);
          throw new Error('APIレスポンスの形式が不正です');
        }
        return parsedContent;
      } catch (error) {
        console.error('Response parsing error:', error, 'Content:', content);
        throw new Error('APIレスポンスの解析に失敗しました');
      }
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('予期せぬエラーが発生しました');
    }
  }
} 