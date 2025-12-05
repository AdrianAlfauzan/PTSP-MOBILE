import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

// OUR HOOKS
import { useGetCartOrderScreen } from '@/hooks/Backend/useGetCartOrderScreen';
import { useAIChatSystem } from '@/hooks/ai-chat/useAIChatSystem';

// OUR INTERFACES
import { Message } from '@/interfaces/ai-chat/ai-chat';

// OUR UTILITIES
import { parseBoldText } from '@/utils/textBoldFormatter';
import { showAlertMessage } from '@/utils/showAlertMessage';

const ChatAI = () => {
  const router = useRouter();
  const { hasCartItems } = useGetCartOrderScreen();

  const { messages, loading, showActionButton, actionButtonType, sendMessage } =
    useAIChatSystem({
      hasCartItems,
      initialMessage:
        'Halo! Saya asisten AI PTSP. Silakan tanyakan tentang layanan PTSP, pengajuan, atau persyaratan dokumen.',
    });

  const [inputText, setInputText] = useState<string>('');

  const handleSend = async (): Promise<void> => {
    await sendMessage(inputText);
    setInputText('');
  };

  const routerPush = (): void => {
    if (actionButtonType === 'submission' && hasCartItems) {
      // Hanya ke pengajuan jika button submission DAN ada cart items
      router.push('/screens/submissionScreen');
    } else if (actionButtonType === 'products') {
      // Ke produk untuk button products
      router.push('/(tabs)/product');
    } else if (actionButtonType === 'submission' && !hasCartItems) {
      // Jika button submission tapi tidak ada cart items
      // Tampilkan alert atau tidak melakukan apa-apa
      showAlertMessage(
        'Tidak ada pesanan',
        'Anda belum memiliki pesanan di keranjang. Silakan tambahkan layanan terlebih dahulu.'
      );
      // Atau arahkan ke produk
      router.push('/(tabs)/product');
    }
  };

  // PERBAIKI: Text button berdasarkan kondisi
  const getButtonText = (): string => {
    if (actionButtonType === 'submission' && hasCartItems) {
      return '📋 Lanjut ke Pengajuan';
    } else if (actionButtonType === 'submission' && !hasCartItems) {
      return '🛒 Belum Ada Pesanan - Lihat Produk';
    } else if (actionButtonType === 'products') {
      return '🛒 Buka Katalog Produk';
    }
    return '';
  };

  const getButtonColor = (): string => {
    if (actionButtonType === 'submission' && hasCartItems) {
      return '#28a745'; // Hijau untuk pengajuan (ada cart)
    } else if (actionButtonType === 'submission' && !hasCartItems) {
      return '#ffc107'; // Kuning untuk pengajuan (tidak ada cart)
    } else if (actionButtonType === 'products') {
      return '#007AFF'; // Biru untuk produk
    }
    return '#007AFF';
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`mb-3 max-w-[85%] rounded-2xl p-3 shadow-sm ${
        item.sender === 'user'
          ? 'self-end bg-blue-500'
          : 'self-start border border-gray-300 bg-white'
      } ${item.isError ? 'border border-yellow-300 bg-yellow-100' : ''} `}
    >
      <Text
        className={`text-base leading-5 ${item.sender === 'user' ? 'text-white' : 'text-gray-800'} ${item.isError ? 'text-yellow-800' : ''} `}
      >
        {parseBoldText(item.text)}
      </Text>
      {item.timestamp && (
        <Text className="mt-1 text-xs text-gray-600 opacity-60">
          {new Date(item.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      />

      {showActionButton && (
        <TouchableOpacity
          className="mx-4 items-center rounded-xl p-4 shadow-md"
          style={{ backgroundColor: getButtonColor() }}
          onPress={routerPush}
        >
          <Text className="text-base font-bold text-white">
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-end border-t border-gray-300 bg-white p-4">
        <TextInput
          className="mr-3 max-h-24 flex-1 rounded-3xl border border-gray-400 bg-gray-50 px-4 py-2 text-base"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Tanya seputar PTSP"
          placeholderTextColor="#999"
          multiline
          editable={!loading}
          maxLength={500}
        />

        <TouchableOpacity
          className={`h-11 w-11 items-center justify-center rounded-full ${loading || !inputText.trim() ? 'bg-gray-400' : 'bg-blue-500'} `}
          onPress={handleSend}
          disabled={loading || !inputText.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-lg font-bold text-white">➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatAI;
