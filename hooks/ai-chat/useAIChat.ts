import { useState, useCallback } from 'react';
import { Message } from '@/interfaces/ai-chat/ai-chat';
import { getAIResponse } from '@/lib/services/ai/geminiService';
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

interface UseAIChatProps {
  initialMessage?: string;
  hasCartItems: boolean;
  products: ProductDataBackendProps[];
}

export const useAIChat = ({
  initialMessage = 'Halo! Saya asisten AI PTSP. Silakan tanyakan tentang layanan PTSP, pengajuan, atau persyaratan dokumen.',
  hasCartItems,
  products,
}: UseAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: initialMessage,
      sender: 'ai',
      timestamp: Date.now(),
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionButtonType, setActionButtonType] = useState<
    'products' | 'submission' | null
  >(null);

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      if (!text.trim() || loading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: 'user',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);
      setActionButtonType(null); // Reset dulu

      try {
        const aiResponse = await getAIResponse(text, hasCartItems, products);

        console.log('🔍 AI RESPONSE:', aiResponse); // ✅ DEBUG

        // ✅ BENAR: Lowercase konsisten & simple detection
        const lowerResponse = aiResponse.toLowerCase();

        if (lowerResponse.includes('pengajuan')) {
          console.log('🎯 SETTING SUBMISSION BUTTON');
          setActionButtonType('submission');
        } else if (lowerResponse.includes('katalog')) {
          console.log('🎯 SETTING PRODUCTS BUTTON');
          setActionButtonType('products');
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: 'ai',
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text:
            err instanceof Error
              ? err.message
              : 'Terjadi kesalahan tak terduga. Silakan coba lagi.',
          sender: 'ai',
          timestamp: Date.now(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan tak terduga. Silakan coba lagi.'
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, hasCartItems, products]
  );

  const clearError = useCallback(() => setError(null), []);
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: initialMessage,
        sender: 'ai',
        timestamp: Date.now(),
      },
    ]);
    setActionButtonType(null);
  }, [initialMessage]);

  return {
    messages,
    loading,
    error,
    showActionButton: actionButtonType !== null,
    actionButtonType,
    sendMessage,
    clearError,
    clearMessages,
  };
};
