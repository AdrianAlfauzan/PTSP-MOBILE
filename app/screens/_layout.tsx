// layouts/ScreensLayout.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

// OUR COMPONENTS
import NavbarForScreens from '@/components/navbarForScreens';
// OUR CONTEXT
import { NavbarContextProvider } from '@/context/NavbarContext';
import { SearchProvider } from '@/context/SearchContext';

// OUR HOOKS
import { useInternetStatus } from '@/hooks/Backend/useInternetStatus';
import useNavbarVisibility from '@/hooks/Frontend/useNavbarVisibility';

export default function ScreensLayout() {
  const { showNavbar } = useNavbarVisibility();
  const { isConnected } = useInternetStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  return (
    <SearchProvider>
      <NavbarContextProvider>
        <View className="flex-1">
          {showNavbar && <NavbarForScreens />}
          <Stack screenOptions={{ headerShown: false }} />
          {!isConnected && (
            <View
              className="absolute bottom-0 w-full bg-red-600 p-2"
              style={{ zIndex: 1000 }}
            >
              <Text className="font-LexBold text-center text-white">
                Tidak ada koneksi internet
              </Text>
            </View>
          )}
          {showReconnected && (
            <View
              className="absolute bottom-0 w-full bg-green-600 p-2"
              style={{ zIndex: 1000 }}
            >
              <Text className="font-LexBold text-center text-white">
                Koneksi berhasil kembali
              </Text>
            </View>
          )}
        </View>
      </NavbarContextProvider>
    </SearchProvider>
  );
}
