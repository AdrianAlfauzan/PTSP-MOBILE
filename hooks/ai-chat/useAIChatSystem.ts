import { useAIChat } from '@/hooks/ai-chat/useAIChat';
import { useAIProducts } from '@/hooks/ai-chat/useAIProducts';

interface UseAIChatSystemProps {
  hasCartItems: boolean;
  initialMessage?: string;
}

export const useAIChatSystem = ({
  hasCartItems,
  initialMessage,
}: UseAIChatSystemProps) => {
  const { products, loading: productsLoading } = useAIProducts();

  const aiChat = useAIChat({
    initialMessage,
    hasCartItems,
    products,
  });

  return {
    // AI Chat functions
    messages: aiChat.messages,
    loading: aiChat.loading,
    error: aiChat.error,
    showActionButton: aiChat.showActionButton,
    actionButtonType: aiChat.actionButtonType,
    sendMessage: aiChat.sendMessage,
    clearError: aiChat.clearError,
    clearMessages: aiChat.clearMessages,

    // Products info
    products,
    productsLoading,
    hasProducts: products.length > 0,

    // Combined loading state
    isLoading: aiChat.loading || productsLoading,
  };
};
