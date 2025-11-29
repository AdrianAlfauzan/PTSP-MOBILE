// interfaces/ai-chat/ai-chat.ts
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  isError?: boolean;
}

export interface ChatHistory {
  userId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}
