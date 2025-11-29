// config/gemini.ts
import Constants from 'expo-constants';

export const GEMINI_CONFIG = {
  API_KEY: Constants.expoConfig?.extra?.GEMINI_API_KEY,
  MODEL_AI: Constants.expoConfig?.extra?.GEMINI_MODEL,
} as const;

// ✅ Validasi
if (!GEMINI_CONFIG.API_KEY) {
  throw new Error('GEMINI_API_KEY is required in environment variables');
}
