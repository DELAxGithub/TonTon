import { readFileSync } from 'fs';
import fetch from 'node-fetch';

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

async function exportToFigma() {
  const layout = JSON.parse(
    readFileSync('src/components/generated/TonTonLayout.json', 'utf-8')
  );

  const response = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_ID}/nodes`,
    {
      method: 'POST',
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodes: [layout]
      })
    }
  );

  const result = await response.json();
  console.log('エクスポート完了:', result);
}

exportToFigma().catch(console.error); 