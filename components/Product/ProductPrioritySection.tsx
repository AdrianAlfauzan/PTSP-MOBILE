// components/ProductPrioritySection.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// HOOK
import { useGetTopProducts } from '@/hooks/Backend/useGetTopProducts';

// INTERFACES
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

interface ProductPrioritySectionProps {
  onAddToCart: (item: ProductDataBackendProps) => void;
  loadingAddToCart: boolean;
}

export default function ProductPrioritySection({
  onAddToCart,
  loadingAddToCart,
}: ProductPrioritySectionProps) {
  const { topProducts, loadingTop } = useGetTopProducts();

  return (
    <View className="px-4 py-3">
      <Text
        className="mb-3 text-center text-xl text-yellow-600"
        style={{ fontFamily: 'LexBold' }}
      >
        ⭐ Produk Prioritas
      </Text>

      {loadingTop ? (
        <Text className="py-4 text-center text-gray-500">Memuat...</Text>
      ) : topProducts.length === 0 ? (
        <Text className="py-4 text-center text-gray-500">
          Tidak ada produk prioritas
        </Text>
      ) : (
        topProducts.map((item) => (
          <View
            key={item.id}
            className="my-3 items-center justify-center gap-6"
          >
            <View className="h-auto w-[85%] rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5">
              {/* GAMBAR */}
              <View className="h-[200px] w-full shadow-xl">
                <Image
                  source={require('@/assets/images/ProductScreen/bg-icon.png')}
                  className="h-full w-full rounded-[20px] object-cover"
                />

                <View className="absolute inset-0 flex items-center justify-center px-2">
                  <Text
                    style={{ fontFamily: 'LexBold' }}
                    className="text-md text-center font-semibold text-white"
                  >
                    {item.Nama}
                  </Text>
                </View>
              </View>

              {/* HARGA */}
              <Text
                style={{ fontFamily: 'LexMedium' }}
                className="py-3 text-center text-lg"
              >
                Rp {item.Harga.toLocaleString('id-ID')}
              </Text>

              {/* BUTTON ADD TO CART */}
              <TouchableOpacity
                disabled={loadingAddToCart}
                onPress={() => onAddToCart(item)}
                className="w-56 flex-row items-center justify-center gap-2 self-center rounded-lg bg-yellow-500 px-4 py-2.5"
              >
                <MaterialIcons name="star" size={18} color="white" />
                <Text className="text-xs uppercase text-white">
                  {loadingAddToCart ? 'Menambahkan...' : 'Tambah Prioritas'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
