// OUR CONSTANTS
import { submissionOptions } from '@/constants/submissionOptions'; // ✅ IMPORT

// OUR INTERFACES
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

// OUR LIBRARIES
import { detectIntent } from '@/lib/services/helpers/intentDetector';
import { formatAIResponse } from '@/lib/services/helpers/responseFormatter';
import { buildAIPrompt } from '@/lib/services/helpers/promptBuilder';
import { callGeminiAPI } from '@/lib/services/helpers/apiHandler';

export const getAIResponse = async (
  userQuestion: string,
  userHasItems: boolean = false,
  products: ProductDataBackendProps[] = []
): Promise<string> => {
  try {
    const lowerQuestion = userQuestion.toLowerCase();

    // Deteksi intent
    const { isAboutProducts, isAboutSubmission } = detectIntent(lowerQuestion);

    console.log(`🤔 Question: "${userQuestion}"`);
    console.log(`📦 Is about products: ${isAboutProducts}`);
    console.log(`📊 Products data: ${products.length} items`);

    // ✅ PASS submissionOptions ke prompt builder
    const prompt = buildAIPrompt(
      userQuestion,
      userHasItems,
      products,
      submissionOptions // ✅ TAMBAH PARAMETER INI
    );

    console.log('🔄 Mengirim ke Gemini AI...');

    // Call Gemini API
    const aiText = await callGeminiAPI(prompt);

    // Format response
    return formatAIResponse(
      aiText,
      userQuestion,
      userHasItems,
      isAboutProducts,
      isAboutSubmission,
      products
    );
  } catch (error) {
    console.log('❌ Error Gemini AI:', error);
    throw new Error('Layanan AI sedang tidak tersedia. Silakan coba lagi.');
  }
};
