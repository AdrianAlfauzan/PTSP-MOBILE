import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

// COMPONENTS
import NavbarForScreens from '@/components/navbarForScreens';

// CONTEXT
import { NavbarContextProvider } from '@/context/NavbarContext';
import { SearchProvider } from '@/context/SearchContext';

// HOOKS
import { useInternetStatus } from '@/hooks/Backend/useInternetStatus';
import useNavbarVisibility from '@/hooks/Frontend/useNavbarVisibility';
import { useGlobalSearch } from '@/hooks/Frontend/useGlobalSearch';

export default function ScreensLayout() {
  const { isConnected } = useInternetStatus();
  const { showNavbar } = useNavbarVisibility();

  const { searchQuery, updateSearchQuery } = useGlobalSearch([], {
    searchFields: [],
    enabled: true,
  });

  const handleSearchChange = useCallback(
    (query: string) => updateSearchQuery(query),
    [updateSearchQuery]
  );

  const handleSearchSubmit = useCallback(() => {}, []);

  return (
    <SearchProvider>
      <NavbarContextProvider>
        <View className="flex-1">
          {showNavbar && (
            <NavbarForScreens
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
            />
          )}

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
        </View>
      </NavbarContextProvider>
    </SearchProvider>
  );
}
