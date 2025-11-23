import React from 'react';
import { View, Image, TextInput, TouchableOpacity } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';

// OUR COMPONENTS
import ButtonShopAndChat from '@/components/buttonShopAndChat';

// OUR CONTEXT
import { useSearch } from '@/context/SearchContext';

// OUR HOOKS
import useNavbarVisibility from '@/hooks/Frontend/useNavbarVisibility';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function NavbarForTabs() {
  const { showShopButton, showChatButton, pathname } = useNavbarVisibility();
  const { searchQuery, setSearchQuery } = useSearch();
  const isProductPage = pathname?.includes('/product');

  return (
    <View
      className="bg-[#1475BA] shadow-md"
      style={{
        width: wp('100%'),
        paddingTop: hp('6%'),
        paddingBottom: hp('2%'),
        paddingHorizontal: wp('4%'),
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <View
        className="flex-row items-center justify-between"
        style={{ height: hp(6) }}
      >
        <View className="flex-1 flex-row items-center">
          {isProductPage ? (
            <View
              className="flex-1 flex-row items-center rounded-full bg-white"
              style={{
                paddingLeft: wp(3),
                height: hp(5.5),
                marginRight: wp(3),
              }}
            >
              <TextInput
                className="flex-1"
                placeholder="Cari produk..."
                placeholderTextColor="gray"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  fontFamily: 'LexRegular',
                  fontSize: wp(3.6),
                  paddingVertical: 0,
                }}
              />
              <TouchableOpacity
                activeOpacity={0.6}
                className="rounded-full bg-[#72C02C]"
                style={{
                  paddingVertical: hp(0.8),
                  paddingHorizontal: wp(3),
                  marginRight: wp(1.5),
                }}
              >
                <Octicons name="search" size={wp(4.8)} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <Image
              source={require('@/assets/images/HomeScreen/logo.png')}
              style={{
                height: hp('5.5%'),
                width: wp('40%'),
                resizeMode: 'contain',
              }}
            />
          )}
        </View>

        <ButtonShopAndChat
          showButtonShop={showShopButton}
          showButtonChat={showChatButton}
        />
      </View>
    </View>
  );
}
