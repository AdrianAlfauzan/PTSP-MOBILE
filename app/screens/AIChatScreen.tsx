// app/screens/AIChatScreen.tsx
import React from 'react';
import { View } from 'react-native';

// OUR COMPONENTS
import ChatAI from '@/components/ai-chat/ChatAI';
// import TestModelButton from '@/components/ai-chat/TestModelButton';

const AIChatScreen = () => {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* =========JANGAN DI HAPUS============= */}
      {/* <TestModelButton /> */}
      {/* =========JANGAN DI HAPUS============= */}
      <ChatAI />
    </View>
  );
};

export default AIChatScreen;
