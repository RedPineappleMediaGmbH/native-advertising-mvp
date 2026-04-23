import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs';
import path from 'node:path';

const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? 'imagen-4.0-generate-001';

let _client: GoogleGenAI | null = null;

function client(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

export interface ImageGenInput {
  title: string;
  category: string;
  outPath: string;
}

function buildPrompt(title: string, category: string): string {
  return `Editorial news photograph illustrating the following German news article.

Category: ${category}
Title: ${title}

Style: realistic documentary photography, neutral lighting, appropriate for a serious newspaper. No text overlays. No logos. 16:9 aspect.`;
}

export async function generateHeroImage(input: ImageGenInput): Promise<void> {
  const ai = client();
  const prompt = buildPrompt(input.title, input.category);

  const result = await ai.models.generateImages({
    model: IMAGE_MODEL,
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
    },
  });

  const generated = result.generatedImages?.[0];
  if (!generated?.image?.imageBytes) {
    throw new Error(`Imagen returned no image for "${input.title}"`);
  }

  const buffer = Buffer.from(generated.image.imageBytes, 'base64');
  fs.mkdirSync(path.dirname(input.outPath), { recursive: true });
  fs.writeFileSync(input.outPath, buffer);
}
