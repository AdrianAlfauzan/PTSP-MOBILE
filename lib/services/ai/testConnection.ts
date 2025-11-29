// services/testConnection.ts
import { GEMINI_CONFIG } from '@/lib/config/gemini';

export const testGeminiConnection = async (): Promise<string> => {
  try {
    // ✅ DAPATKAN MODEL YANG TERSEDIA
    const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_CONFIG.API_KEY}`;

    const response = await fetch(modelsUrl);
    const data = await response.json();

    if (!data.models || data.models.length === 0) {
      return '❌ Tidak ada model yang tersedia di API Key ini';
    }

    const availableModels = data.models.map((model: any) =>
      model.name.replace('models/', '')
    );

    // ✅ TEST SETIAP MODEL
    const workingModels: string[] = [];

    for (const model of availableModels.slice(0, 3)) {
      // Test 3 model pertama
      try {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_CONFIG.API_KEY}`;

        const testResponse = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Jawab: 'TEST OK'",
                  },
                ],
              },
            ],
          }),
        });

        if (testResponse.ok) {
          workingModels.push(model);
        }
      } catch (error) {
        console.error(`❌ Error testing model ${model}: ${error}`);

        continue;
      }
    }

    if (workingModels.length > 0) {
      return `✅ MODEL YANG WORK: ${workingModels.join(', ')}`;
    } else {
      return '❌ Tidak ada model yang work';
    }
  } catch (error) {
    return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};
