import { GEMINI_CONFIG } from '@/lib/config/gemini';

export const callGeminiAPI = async (prompt: string): Promise<string> => {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.MODEL_AI}:generateContent?key=${GEMINI_CONFIG.API_KEY}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log('❌ Gemini API Error:', response.status, errorText);
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  } else {
    console.log('❌ Format response tidak sesuai:', data);
    throw new Error('Format respons tidak sesuai');
  }
};
