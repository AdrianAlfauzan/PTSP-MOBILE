// components/TestModelButton.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { testGeminiConnection } from '@/lib/services/ai/testConnection'; // ✅ Import dari file yang benar

const TestModelButton = () => {
  const [testResult, setTestResult] = useState('');

  const handleTest = async () => {
    const result = await testGeminiConnection();
    setTestResult(result);
    console.log(result);
  };

  return (
    <View style={{ padding: 16 }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 12,
          borderRadius: 8,
          marginBottom: 8,
        }}
        onPress={handleTest}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Test Available Models
        </Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
        {testResult}
      </Text>
    </View>
  );
};

export default TestModelButton;
