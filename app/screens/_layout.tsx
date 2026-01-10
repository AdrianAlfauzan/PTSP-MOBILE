// layouts/ScreensLayout.tsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

// CONTEXTS
import { SearchProvider } from '@/context/SearchContext';
import { NavbarContextProvider } from '@/context/NavbarContext';
import { useInternetStatusContext } from '@/context/InternetStatusContext';

// COMPONENTS
import NavbarForScreens from '@/components/navbarForScreens';

// HOOKS
import useNavbarVisibility from '@/hooks/Frontend/useNavbarVisibility';

export default function ScreensLayout() {
  const { showNavbar } = useNavbarVisibility();
  const { isConnected, justReconnected } = useInternetStatusContext();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (justReconnected) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [justReconnected]);

  return (
    <SearchProvider>
      <NavbarContextProvider>
        <View className="flex-1">
          {/* Navbar atas */}
          {showNavbar && <NavbarForScreens />}

          {/* Stack navigator */}
          <Stack screenOptions={{ headerShown: false }} />

          {/* Notifikasi koneksi merah */}
          {!isConnected && (
            <View
              className="absolute bottom-0 w-full bg-red-600 p-2"
              style={{ zIndex: 1000 }}
            >
              <Text className="font-LexBold text-center text-red-600">
                Tidak ada koneksi internet
              </Text>
            </View>
          )}

          {/* Notifikasi koneksi pulih hijau */}
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
