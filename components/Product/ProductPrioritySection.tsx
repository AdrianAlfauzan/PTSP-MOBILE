// components/ProductPrioritySection.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

interface ProductPrioritySectionProps {
  title: string;
  products: ProductDataBackendProps[];
  loading: boolean;
  onAddToCart: (item: ProductDataBackendProps) => void;
  icon: React.ReactNode;
  ownerName: string;
  loadingAddToCart: boolean;
}

export default function ProductPrioritySection({
  title,
  products,
  loading,
  onAddToCart,
  icon,
  ownerName,
}: ProductPrioritySectionProps) {
  return (
    <View className="px-4 py-3">
      <Text className="mb-2 text-lg font-semibold">{title}</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : products.length === 0 ? (
        <Text className="py-4 text-center text-gray-500">
          Produk Prioritas Tidak Ditemukan
        </Text>
      ) : (
        products.map((item) => (
          <View
            key={item.id}
            className="mb-3 rounded-xl bg-white p-4 shadow-md"
          >
            {/* Jika kamu mau icon ditampilkan */}
            <View className="flex-row items-center gap-2">
              {icon}
              <Text className="text-base font-semibold">{item.Nama}</Text>
            </View>

            <Text className="text-gray-600">{item.Deskripsi}</Text>
            <Text className="mt-1 font-bold">Rp {item.Harga}</Text>

            {/* Owner / pemilik produk */}
            <Text className="mt-1 text-sm text-gray-500">
              Oleh: {ownerName}
            </Text>

            <TouchableOpacity
              onPress={() => onAddToCart(item)}
              className="mt-3 rounded-lg bg-blue-600 p-2"
            >
              <Text className="text-center text-white">
                Tambah ke Keranjang
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}
