// screens/Product.tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { allProducts } from '@/lib/data/productList';
import { useSearch } from '@/context/SearchContext';
import Button from '@/components/button';

// Import reusable components
import AnimatedTabBar from '@/components/animatedTabBar';
import { useTabAnimation } from '@/hooks/Frontend/useAnimatedTab/useTabAnimation';

// Define tabs
const productTabs = ['Semua', 'Informasi', 'Jasa'] as const;

export default function Product() {
  const router = useRouter();
  const { searchQuery } = useSearch();

  // Use reusable tab animation hook
  const {
    activeTab,
    activeTabOffset,
    activeTabWidth,
    onTabPress,
    onTabLayout,
    tabContainerWidths,
  } = useTabAnimation(productTabs, 'Semua');

  const filteredByCategory = useMemo(() => {
    return activeTab === 'Semua'
      ? allProducts
      : allProducts.filter((item) => item.category === activeTab);
  }, [activeTab]);

  const searchedProducts = useMemo(() => {
    if (!searchQuery.trim()) return filteredByCategory;
    const q = searchQuery.toLowerCase();
    return filteredByCategory.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [filteredByCategory, searchQuery]);

  return (
    <View className="flex-1">
      {/* Reusable Animated Tab Bar */}
      <View className="bg-[#A7CBE5]">
        <AnimatedTabBar
          tabs={productTabs}
          activeTab={activeTab}
          onTabPress={onTabPress}
          activeTabOffset={activeTabOffset}
          activeTabWidth={activeTabWidth}
          tabContainerWidths={tabContainerWidths}
          onTabLayout={onTabLayout}
          config={{
            indicatorColor: '#1475BA',
            containerClassName: 'mx-4 mb-4', // 👈 Tambah margin bottom
            containerStyle: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            },
            textStyle: {
              fontFamily: 'LexBold',
              fontSize: 16,
            },
            activeTextStyle: {
              fontFamily: 'LexBold',
            },
            minTabWidth: 100,
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="bg-[#A7CBE5]"
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
                <View className="absolute inset-0 flex items-center justify-center">
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
                    params: { category: item.paramCategory },
                  })
                }
              >
                Lihat Produk
              </Button>
            </View>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-10">
            <Text
              style={{ fontFamily: 'LexMedium' }}
              className="text-center text-lg text-black"
            >
              {activeTab !== 'Semua'
                ? `Tidak ada produk di kategori ${activeTab}`
                : 'Tidak ada produk yang tersedia'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
