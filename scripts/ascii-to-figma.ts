import { writeFileSync } from 'fs';

interface FigmaComponent {
  name: string;
  type: 'FRAME' | 'TEXT' | 'RECTANGLE';
  x: number;
  y: number;
  width: number;
  height: number;
  children?: FigmaComponent[];
  characters?: string;
}

const ASCII_TO_FIGMA_SCALE = 8; // 1アスキー文字 = 8px

const asciiArt = `
+----------------------------------------+
|                TonTon                  |
+----------------------------------------+
|   2025-04-29  13:42              ≡    |
|                                        |
|  +----------------------------------+  |
|  |  本日の暫定収支 (ムーブ)         |  |
|  |  +--------------+   +----------+  |  |
|  |  | 摂取         |   | 消費     |  |  |
|  |  | 1,150 kcal   |   | 650 kcal |  |  |
|  |  +--------------+   +----------+  |  |
|  |                                  |  |
|  |  暫定収支: -500 kcal             |  |
|  |  [======>-------------------]    |  |
|  |  ※24時に確定します            |  |
|  +----------------------------------+  |
|                                        |
|  +----------------------------------+  |
|  |  前日の確定収支 (トータル)       |  |
|  |  +--------------+   +----------+  |  |
|  |  | 摂取         |   | 消費     |  |  |
|  |  | 1,450 kcal   |   | 1,850 kcal|  |  |
|  |  +--------------+   +----------+  |  |
|  |                                  |  |
|  |  確定収支: +400 kcal (目標達成)  |  |
|  |  [================>---------]    |  |
|  |                                  |  |
|  +----------------------------------+  |
|                                        |
|  +-----------+ +-----------+ +------+ |
|  | 食事記録  | | 運動記録  | | 体重 | |
|  +-----------+ +-----------+ +------+ |
|                                        |
|  +----------------------------------+  |
|  |    月間カロリー貯金: 5,400 kcal  |  |
|  |    [=============>----------]    |  |
|  |    目標: 14,400 kcal (37%)       |  |
|  +----------------------------------+  |
|                                        |
+----------------------------------------+
`.trim();

function parseAsciiToFigma(ascii: string): FigmaComponent {
  const lines = ascii.split('\n');
  const rootComponent: FigmaComponent = {
    name: 'TonTon App',
    type: 'FRAME',
    x: 0,
    y: 0,
    width: lines[0].length * ASCII_TO_FIGMA_SCALE,
    height: lines.length * ASCII_TO_FIGMA_SCALE,
    children: []
  };

  // ヘッダー
  rootComponent.children?.push({
    name: 'Header',
    type: 'FRAME',
    x: 0,
    y: 0,
    width: lines[0].length * ASCII_TO_FIGMA_SCALE,
    height: 3 * ASCII_TO_FIGMA_SCALE,
    children: [
      {
        name: 'Title',
        type: 'TEXT',
        x: 16,
        y: 8,
        width: 200,
        height: 24,
        characters: 'TonTon'
      }
    ]
  });

  // 日付と時刻
  rootComponent.children?.push({
    name: 'DateTime',
    type: 'TEXT',
    x: 16,
    y: 40,
    width: 200,
    height: 24,
    characters: '2025-04-29  13:42'
  });

  // メインコンテンツの変換処理
  // ... (以下、各セクションの変換ロジック)

  return rootComponent;
}

// Figmaのコンポーネント定義をJSONとして出力
const figmaComponent = parseAsciiToFigma(asciiArt);
writeFileSync(
  'src/components/generated/TonTonLayout.json',
  JSON.stringify(figmaComponent, null, 2)
); 