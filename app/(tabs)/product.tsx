import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

// OUR COMPONENTS
import Button from '@/components/button';

// OUR CONTEXT
import { useSearch } from '@/context/SearchContext';

// OUR DATA
import { allProducts } from '@/lib/data/productList';

// OUR INTERFACES
import { ProductType } from '@/interfaces/productDataProps';

export default function Product() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const { searchQuery } = useSearch();

  const filteredProducts =
    activeCategory === 'Semua'
      ? allProducts
      : allProducts.filter((item) => item.category === activeCategory);

  const searchedProducts = filteredProducts.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  return (
    <View className="flex-1">
      {/* TAB CATEGORY */}
      <View className="-mt-2 flex-row items-center justify-center gap-4 bg-[#A7CBE5] pb-2 pt-4">
        {['Semua', 'Informasi', 'Jasa'].map((buttonCategory) => (
          <TouchableOpacity
            key={buttonCategory}
            onPress={() => setActiveCategory(buttonCategory)}
            activeOpacity={0.7}
            className={`rounded-full px-4 py-2 ${
              activeCategory === buttonCategory
                ? 'bg-[#1475BA]'
                : 'bg-transparent'
            }`}
          >
            <Text
              className="text-[16px]"
              style={{
                fontFamily: 'LexBold',
                color: activeCategory === buttonCategory ? 'white' : 'black',
              }}
            >
              {buttonCategory}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="bg-[#A7CBE5]"
      >
        {/* INFO SEARCH */}
        {searchQuery && searchQuery.trim() !== '' && (
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

        {/* DAFTAR PRODUK */}
        {searchedProducts.length > 0 ? (
          searchedProducts.map((item, idx) => (
            <View
              key={idx}
              className="my-3 h-auto w-[74%] self-center rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5"
            >
              <View className="h-[125px] w-full shadow-xl">
                <Image
                  source={require('@/assets/images/ProductScreen/bg-icon.png')}
                  className="h-full w-full rounded-[20px] object-cover"
                />
                <View className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                  {item.icon}
                </View>
              </View>
              <Text
                style={{ fontFamily: 'LexBold' }}
                className="py-2 text-[20px]"
              >
                {item.title}
              </Text>
              <Text
                style={{ fontFamily: 'LexRegular' }}
                className="pb-4 text-[12px]"
              >
                {item.desc}
              </Text>
              <Button
                style="bg-[#1475BA] px-6 py-2 rounded-lg"
                textStyle="text-sm text-white"
                onPress={() =>
                  router.push({
                    pathname: item.pathname,
                    params: { category: item.paramCategory as ProductType },
                  })
                }
              >
                Lihat Produk
              </Button>
            </View>
          ))
        ) : (
          // EMPTY STATE JIKA TIDAK ADA PRODUK
          <View className="flex-1 items-center justify-center py-10">
            <Text
              style={{ fontFamily: 'LexMedium' }}
              className="text-center text-lg text-black"
            >
              {activeCategory !== 'Semua'
                ? `Tidak ada produk di kategori ${activeCategory}`
                : 'Tidak ada produk yang tersedia'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
