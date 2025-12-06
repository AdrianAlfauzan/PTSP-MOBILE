// screens/ProductDetailScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// OUR ICONS
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// OUR COMPONENTS
import Button from '@/components/button';
import { ProductCardInfoButton } from '@/components/productCardInfoButton';

// OUR CONTEXT
import { useSearch } from '@/context/SearchContext';

// OUR HOOKS
import { useGetProductsByCategory } from '@/hooks/Backend/useGetProductsByCategory';
import { usePopupDetailProductAnimation } from '@/hooks/Frontend/popUpInfoCard/usePopupDetailProductAnimation';
import { useAddToCart } from '@/hooks/Backend/useAddToCart';

// OUR INTERFACES
import { ProductType } from '@/interfaces/product/productDataBackendProps';

export default function ProductDetailScreen() {
  // ======================= PARAMS & KATEGORI =======================
  const params = useLocalSearchParams();
  const compositeCategory = params.category as string;
  const { searchQuery } = useSearch();

  const informationOrService = compositeCategory
    ? compositeCategory.split('_')
    : ['', ''];
  const productType = informationOrService[0] as ProductType;
  const categoryForIcon = informationOrService.slice(1).join('_');

  // ======================= HOOKS =======================
  const { products, ownerName, icon, loading, error } =
    useGetProductsByCategory(compositeCategory);
  const { activePopupIndex, togglePopup, closePopup, fadeAnim } =
    usePopupDetailProductAnimation();
  const { loadingAddToCart, addToCart } = useAddToCart();

  // ======================= FILTER SEARCH =======================
  const searchedProducts = useMemo(() => {
    if (!searchQuery.trim()) return products || [];
    const q = searchQuery.toLowerCase();
    return (products || []).filter(
      (product) =>
        product.Nama.toLowerCase().includes(q) ||
        (product.Deskripsi && product.Deskripsi.toLowerCase().includes(q)) ||
        product.Pemilik.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <View className="flex-1 bg-[#A7CBE5]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          if (activePopupIndex !== null) closePopup();
        }}
      >
        {searchQuery.trim().length > 0 && (
          <View className="mx-4 mb-2 self-center rounded-lg bg-blue-100 px-4 py-2">
            <Text
              style={{ fontFamily: 'LexMedium' }}
              className="text-lg text-blue-800"
            >
              {searchedProducts.length > 0
                ? `Ditemukan ${searchedProducts.length} produk untuk "${searchQuery}"`
                : `Tidak ada hasil untuk "${searchQuery}"`}
            </Text>
          </View>
        )}

        <Text
          style={{ fontFamily: 'LexBold' }}
          className="mt-4 text-center text-2xl"
        >
          {productType}
        </Text>
        <Text
          style={{ fontFamily: 'LexMedium' }}
          className="text-md mb-4 mt-1 text-center uppercase"
        >
          Stasiun {ownerName}
        </Text>

        {loading ? (
          [...Array(3)].map((_, index) => (
            <View
              key={index}
              className="my-3 items-center justify-center gap-6"
            >
              <View className="h-auto w-[74%] rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5">
                <View className="h-[200px] w-full animate-pulse rounded-[20px] bg-gray-200" />
                <View className="mt-4 h-4 w-40 animate-pulse self-center rounded bg-gray-200" />
                <View className="mt-3 h-4 w-24 animate-pulse self-center rounded bg-gray-200" />
                <View className="mt-5 h-10 w-56 animate-pulse self-center rounded-lg bg-gray-300" />
              </View>
            </View>
          ))
        ) : error ? (
          <View className="self-center py-4">
            <Text
              style={{ fontFamily: 'LexRegular' }}
              className="text-center text-lg text-red-500"
            >
              {error}
            </Text>
          </View>
        ) : searchedProducts.length > 0 ? (
          searchedProducts.map((item, index) => (
            <View
              key={`${item.id}-${index}`}
              className="my-3 items-center justify-center gap-6"
            >
              <View className="h-auto w-[74%] rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5">
                <ProductCardInfoButton
                  productIndex={index}
                  activePopupIndex={activePopupIndex}
                  togglePopup={togglePopup}
                  fadeAnim={fadeAnim}
                  closePopup={closePopup}
                />

                <View className="h-[200px] w-full shadow-xl">
                  <Image
                    source={require('@/assets/images/ProductScreen/bg-icon.png')}
                    className="h-full w-full rounded-[20px] object-cover"
                  />
                  <View className="absolute inset-0 flex items-center justify-center gap-2 px-2">
                    {icon}
                    <Text
                      style={{ fontFamily: 'LexMedium' }}
                      className="text-md text-center font-semibold text-white"
                    >
                      {item.Nama}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{ fontFamily: 'LexMedium' }}
                  className="py-3 text-center text-lg"
                >
                  Rp {item.Harga.toLocaleString('id-ID')}
                </Text>

                <Button
                  style="bg-[#1475BA] px-4 py-2.5 rounded-lg mt-auto w-56 self-center"
                  textStyle="text-xs text-white uppercase"
                  icon={
                    <MaterialIcons
                      name="shopping-cart"
                      size={15}
                      color="white"
                    />
                  }
                  onPress={() => addToCart(item, productType)}
                  disabled={loadingAddToCart}
                >
                  {loadingAddToCart ? 'Menambahkan...' : 'Masukan Ke Keranjang'}
                </Button>
              </View>
            </View>
          ))
        ) : (
          <View className="self-center py-4">
            <Text
              style={{ fontFamily: 'LexRegular' }}
              className="text-center text-lg text-black"
            >
              {searchQuery
                ? `Tidak ada produk "${searchQuery}" dalam ${categoryForIcon}.`
                : `Tidak ada produk ${categoryForIcon}.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
