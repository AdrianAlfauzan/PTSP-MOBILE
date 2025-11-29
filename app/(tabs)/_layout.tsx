import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// OUR CONTEXTS
import { SearchProvider } from '@/context/SearchContext';
import { useInternetStatusContext } from '@/context/InternetStatusContext';

// OUR COMPONENTS
import TabNavigator from '@/components/TabNavigator';
import NavbarForTabs from '@/components/navbarForTabs';

// OUR HOOKS
import useNavbarVisibility from '@/hooks/Frontend/useNavbarVisibility';

export default function TabsLayout() {
  const { showNavbar } = useNavbarVisibility();
  const { isConnected, justReconnected } = useInternetStatusContext(); // sudah ada context dari RootLayout
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
      <View className="flex-1">
        {showNavbar && <NavbarForTabs />}
        <TabNavigator />

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
    </SearchProvider>
  );
}
