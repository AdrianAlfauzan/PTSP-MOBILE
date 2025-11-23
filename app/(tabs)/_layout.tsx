import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// OUR COMPONENTS
import NavbarForTabs from '@/components/navbarForTabs';
import TabNavigator from '@/components/TabNavigator';

// OUR CONTEXT
import { SearchProvider } from '@/context/SearchContext';

// OUR HOOKS
import { useInternetStatus } from '@/hooks/Backend/useInternetStatus';
import useNavbarVisibility from '@/hooks/Frontend/useNavbarVisibility';

export default function TabsLayout() {
  const { showNavbar } = useNavbarVisibility();
  const { isConnected } = useInternetStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  // Munculkan notifikasi "Koneksi berhasil kembali" hanya sebentar
  useEffect(() => {
    if (isConnected) {
      setShowReconnected(true);

      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  return (
    <SearchProvider>
      <View className="flex-1">
        {showNavbar && <NavbarForTabs />}

        <TabNavigator />

        {/* Jika tidak ada koneksi */}
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

        {/* Jika koneksi baru saja pulih */}
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
