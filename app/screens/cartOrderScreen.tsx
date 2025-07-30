import React, { useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';

// OUR COMPONENTS
import ButtonCustom from '@/components/buttonCustom';
import NavCartOrder from '@/components/navCartOrder';
import SwipeableRow from '@/components/swipeableRow';

// OUR HOOKS
import { useGetCartOrderScreen } from '@/hooks/Backend/useGetCartOrderScreen';
import { useDeleteCartOrderScreen } from '@/hooks/Backend/useDeleteCartOrderScreen';
import { useUpdateCartQuantityScreen } from '@/hooks/Backend/useUpdateCartQuantityScreen';

// OUR ICONS
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CartOrderScreen() {
  const router = useRouter();
  const { cartItems, totalHarga, loading } = useGetCartOrderScreen();
  const { removeFromCart } = useDeleteCartOrderScreen();
  const { updateQuantity } = useUpdateCartQuantityScreen();
  const [editableIndex, setEditableIndex] = React.useState<number | null>(null);
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View className="flex-1 bg-[#A7CBE5]">
      <NavCartOrder
        text="Keranjang Saya"
        textClassName="ml-4 text-left"
        onPressLeftIcon={() => router.back()}
        isTouchable={false}
      />
      <View className="flex-1 bg-[#A7CBE5] px-4">
        <ScrollView
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 160,
            paddingHorizontal: 10,
          }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <>
              {[...Array(cartItems?.length > 0 ? cartItems.length : 3)].map(
                (_, i) => (
                  <Animated.View key={i} style={{ opacity: pulseAnim }}>
                    <ImageBackground
                      className="relative mb-4 gap-5 rounded-md p-6 shadow"
                      style={{ overflow: 'hidden', borderRadius: 10 }}
                      source={require('@/assets/images/ProductScreen/bg-icon.png')}
                      resizeMode="cover"
                    >
                      <View className="absolute right-3 top-3 h-4 w-[50px] rounded bg-gray-300" />

                      <View className="flex-row items-center pt-5">
                        <View className="h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-300" />
                        <View className="ml-4 h-4 flex-1 rounded bg-gray-300" />
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-5">
                          <View className="h-[24px] w-[24px] rounded-full bg-gray-300" />
                          <View className="h-[16px] w-[40px] rounded bg-gray-300" />
                          <View className="h-[24px] w-[24px] rounded-full bg-gray-300" />
                        </View>
                        <View className="h-[16px] w-[80px] rounded bg-gray-300" />
                      </View>
                    </ImageBackground>
                  </Animated.View>
                )
              )}
            </>
          ) : cartItems.length === 0 ? (
            <View className="items-center justify-center py-10">
              <View className="rounded-full bg-[#1475BA] p-5">
                <MaterialCommunityIcons
                  name="cart-remove"
                  size={60}
                  color="white"
                />
              </View>
              <Text
                style={{ fontFamily: 'LexBold' }}
                className="mt-4 text-center text-xl font-semibold text-gray-700"
              >
                Keranjangmu kosong
              </Text>
              <Text
                style={{ fontFamily: 'LexMedium' }}
                className="mt-2 text-center text-sm text-gray-500"
              >
                Yuk, mulai tambahkan barang ke keranjangmu dan belanja sekarang!
              </Text>

              <TouchableOpacity
                className="mt-6 rounded-full bg-[#1475BA] px-6 py-3"
                onPress={() => router.push('/(tabs)/product')}
                activeOpacity={0.7}
              >
                <Text
                  className="text-white"
                  style={{ fontFamily: 'LexMedium' }}
                >
                  Belanja Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            cartItems.map((item, index) => {
              const isEditable = editableIndex === index;

              const card = (
                <ImageBackground
                  className="mb-4 gap-6 rounded-md p-6 shadow"
                  style={{ overflow: 'hidden', borderRadius: 10 }}
                  source={require('@/assets/images/ProductScreen/bg-icon.png')}
                  resizeMode="cover"
                >
                  <View className="flex-row items-center pt-3">
                    <View className="h-auto w-auto items-center justify-center">
                      <FontAwesome6 name="mountain" size={55} color="white" />
                    </View>
                    <Text
                      className="ml-4 flex-1 text-[14px] text-white"
                      style={{ fontFamily: 'LexSemiBold' }}
                    >
                      {item.Nama}
                    </Text>
                    <TouchableOpacity
                      className="absolute -right-1 -top-4 self-start rounded-full p-1"
                      onPress={() =>
                        setEditableIndex((prev) =>
                          prev === index ? null : index
                        )
                      }
                    >
                      <Text
                        className="text-white"
                        style={{ fontFamily: 'LexMedium' }}
                      >
                        {isEditable ? 'Selesai' : 'Ubah'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Kuantitas dan Harga */}
                  <View className="mt-2 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-5">
                      <MaterialIcons
                        name="remove-circle-outline"
                        size={24}
                        color="white"
                        onPress={() => {
                          const type = item.ID_Informasi ? 'Informasi' : 'Jasa';
                          updateQuantity(
                            item.ID_Informasi || item.ID_Jasa || '',
                            type,
                            'decrement'
                          );
                        }}
                      />
                      <Text
                        className="text-[14px]"
                        style={{ fontFamily: 'LexSemiBold', color: 'white' }}
                      >
                        x{item.Kuantitas}
                      </Text>
                      <MaterialIcons
                        name="add-circle-outline"
                        size={24}
                        color="white"
                        onPress={() => {
                          const type = item.ID_Informasi ? 'Informasi' : 'Jasa';
                          updateQuantity(
                            item.ID_Informasi || item.ID_Jasa || '',
                            type,
                            'increment'
                          );
                        }}
                      />
                    </View>
                    <Text
                      className="text-[15px]"
                      style={{ fontFamily: 'LexSemiBold', color: 'white' }}
                    >
                      Rp {item.Total_Harga.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </ImageBackground>
              );

              return !loading ? (
                <SwipeableRow
                  key={index}
                  isOpen={isEditable}
                  onDelete={() => {
                    const type = item.ID_Informasi ? 'Informasi' : 'Jasa';
                    removeFromCart(
                      item.ID_Informasi || item.ID_Jasa || '',
                      type
                    );
                    setEditableIndex(null);
                  }}
                >
                  {card}
                </SwipeableRow>
              ) : null;
            })
          )}
        </ScrollView>

        {/* Total dan Button */}
        <View className="bottom-6 flex w-full flex-row justify-between gap-2 px-2">
          <View className="flex flex-1 flex-row items-center justify-between rounded-[10px] bg-[#1475BA] px-4 py-3">
            <Text className="text-white" style={{ fontFamily: 'LexSemiBold' }}>
              Total Harga
            </Text>
            <Text
              className="ml-4 text-white"
              style={{ fontFamily: 'LexSemiBold' }}
            >
              {totalHarga.toLocaleString('id-ID')}
            </Text>
          </View>

          <ButtonCustom
            classNameContainer="bg-[#1475BA] py-3 rounded-[10px] w-[120px]"
            text="Lanjutkan Pemesanan"
            textClassName="text-[11px] text-center text-white"
            onPress={() => router.push('/screens/submissionScreen')}
            textStyle={{ fontFamily: 'LexSemiBold' }}
            isTouchable={cartItems.length > 0}
            containerStyle={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 4,
            }}
          />
        </View>
      </View>
      <View className="h-[4%] w-full bg-[#1475BA]" />
    </View>
  );
}
