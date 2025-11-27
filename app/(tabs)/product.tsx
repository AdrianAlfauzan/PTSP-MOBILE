// screens/Product.tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

// COMPONENTS
import Button from '@/components/button';
import AnimatedTabBar from '@/components/animatedTabBar';

// OUR CONSTANTS
import { productTabs } from '@/constants/productTabs';

// HOOKS
import { useTabAnimation } from '@/hooks/Frontend/useAnimatedTab/useTabAnimation';
import { useSkeletonForTab } from '@/hooks/Frontend/skeletons/useSkeletonForTab';

// SKELETON
import { WrapperSkeletonProductTab } from '@/components/skeletons/wrapperSkeletonProductTab';

// DATA
import { productList } from '@/lib/data/productList';

// CONTEXT
import { useSearch } from '@/context/SearchContext';

export default function Product() {
  const router = useRouter();
  const { searchQuery } = useSearch();

  // Animated Tab Hook
  const {
    activeTab,
    activeTabOffset,
    activeTabWidth,
    onTabPress,
    onTabLayout,
    tabContainerWidths,
  } = useTabAnimation(productTabs, 'Semua');

  // Skeleton loading
  const showSkeleton = useSkeletonForTab(activeTab);

  // --- FILTER BERDASARKAN TAB ---
  const filteredByCategory = useMemo(() => {
    return activeTab === 'Semua'
      ? productList
      : productList.filter((item) => item.category === activeTab);
  }, [activeTab]);

  // --- FILTER BERDASARKAN SEARCH ---
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

  // --- UTILITY: FILTER BERDASARKAN CATEGORY DAN SEARCH UNTUK "Semua" ---
  const informasiProducts = useMemo(() => {
    return searchedProducts.filter((item) => item.category === 'Informasi');
  }, [searchedProducts]);

  const jasaProducts = useMemo(() => {
    return searchedProducts.filter((item) => item.category === 'Jasa');
  }, [searchedProducts]);

  return (
    <View className="flex-1">
      {/* Animated Tab Bar */}
      <View className="bg-[#A7CBE5] pb-1 pt-2">
        <AnimatedTabBar
          tabs={productTabs}
          activeTab={activeTab}
          onTabPress={onTabPress}
          activeTabOffset={activeTabOffset}
          activeTabWidth={activeTabWidth}
          tabContainerWidths={tabContainerWidths}
          onTabLayout={onTabLayout}
          tabBarStyleConfig={{
            indicatorColor: '#1475BA',
            containerClassName: 'p-1',
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
        className="bg-[#A7CBE5]"
        showsVerticalScrollIndicator={false}
      >
        {/* ================= SEARCH INFO ================= */}
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

        {/* =============== ALL PRODUK =============== */}
        {activeTab === 'Semua' && (
          <View className="">
            {showSkeleton ? (
              <WrapperSkeletonProductTab />
            ) : (
              <>
                {/* --- PRODUK INFORMASI --- */}
                <SectionTitle title="Produk Informasi" />

                {informasiProducts.map((item, idx) => (
                  <View
                    key={idx}
                    className="mt-3 h-auto w-[74%] self-center rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5"
                  >
                    {/* IMAGE */}
                    <View className="h-[125px] w-full shadow-xl">
                      <Image
                        source={require('@/assets/images/ProductScreen/bg-icon.png')}
                        className="h-full w-full rounded-[20px]"
                      />
                      <View className="absolute inset-0 items-center justify-center">
                        {item.icon}
                      </View>
                    </View>

                    {/* TITLE */}
                    <Text
                      style={{ fontFamily: 'LexBold' }}
                      className="py-2 text-[20px]"
                    >
                      {item.title}
                    </Text>

                    {/* DESCRIPTION */}
                    <Text
                      style={{ fontFamily: 'LexRegular' }}
                      className="pb-4 text-[12px]"
                    >
                      {item.desc}
                    </Text>

                    {/* BUTTON */}
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
                ))}

                {/* --- PRODUK JASA --- */}
                <SectionTitle title="Produk Jasa" />

                {jasaProducts.map((item, idx) => (
                  <View
                    key={idx}
                    className="mt-3 h-auto w-[74%] self-center rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5"
                  >
                    {/* IMAGE */}
                    <View className="h-[125px] w-full shadow-xl">
                      <Image
                        source={require('@/assets/images/ProductScreen/bg-icon.png')}
                        className="h-full w-full rounded-[20px]"
                      />
                      <View className="absolute inset-0 items-center justify-center">
                        {item.icon}
                      </View>
                    </View>

                    {/* TITLE */}
                    <Text
                      style={{ fontFamily: 'LexBold' }}
                      className="py-2 text-[20px]"
                    >
                      {item.title}
                    </Text>

                    {/* DESCRIPTION */}
                    <Text
                      style={{ fontFamily: 'LexRegular' }}
                      className="pb-4 text-[12px]"
                    >
                      {item.desc}
                    </Text>

                    {/* BUTTON */}
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
                ))}
              </>
            )}
          </View>
        )}

        {/* =============== INFORMASI SAJA =============== */}
        {activeTab === 'Informasi' && (
          <View className="">
            {showSkeleton ? (
              <WrapperSkeletonProductTab />
            ) : (
              <>
                <SectionTitle title="Produk Informasi" />

                {searchedProducts
                  .filter((item) => item.category === 'Informasi')
                  .map((item, idx) => (
                    <View
                      key={idx}
                      className="mt-3 h-auto w-[74%] self-center rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5"
                    >
                      {/* IMAGE */}
                      <View className="h-[125px] w-full shadow-xl">
                        <Image
                          source={require('@/assets/images/ProductScreen/bg-icon.png')}
                          className="h-full w-full rounded-[20px] object-cover"
                        />
                        <View className="absolute inset-0 flex items-center justify-center">
                          {item.icon}
                        </View>
                      </View>

                      {/* TITLE */}
                      <Text
                        style={{ fontFamily: 'LexBold' }}
                        className="py-2 text-[20px]"
                      >
                        {item.title}
                      </Text>

                      {/* DESC */}
                      <Text
                        style={{ fontFamily: 'LexRegular' }}
                        className="pb-4 text-[12px]"
                      >
                        {item.desc}
                      </Text>

                      {/* BUTTON */}
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
                  ))}
              </>
            )}
          </View>
        )}

        {/* =============== JASA SAJA =============== */}
        {activeTab === 'Jasa' && (
          <View className="">
            {showSkeleton ? (
              <WrapperSkeletonProductTab />
            ) : (
              <>
                <SectionTitle title="Produk Jasa" />

                {searchedProducts
                  .filter((item) => item.category === 'Jasa')
                  .map((item, idx) => (
                    <View
                      key={idx}
                      className="mt-3 h-auto w-[74%] self-center rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5"
                    >
                      {/* IMAGE */}
                      <View className="h-[125px] w-full shadow-xl">
                        <Image
                          source={require('@/assets/images/ProductScreen/bg-icon.png')}
                          className="h-full w-full rounded-[20px] object-cover"
                        />
                        <View className="absolute inset-0 flex items-center justify-center">
                          {item.icon}
                        </View>
                      </View>

                      {/* TITLE */}
                      <Text
                        style={{ fontFamily: 'LexBold' }}
                        className="py-2 text-[20px]"
                      >
                        {item.title}
                      </Text>

                      {/* DESCRIPTION */}
                      <Text
                        style={{ fontFamily: 'LexRegular' }}
                        className="pb-4 text-[12px]"
                      >
                        {item.desc}
                      </Text>

                      {/* BUTTON */}
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
                  ))}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ==========================================
// COMPONENT: SECTION TITLE
// ==========================================
const SectionTitle = ({ title }: { title: string }) => (
  <View className="self-center py-1 pt-5">
    <Text style={{ fontFamily: 'LexBold' }} className="text-[20px]">
      {title}
    </Text>
  </View>
);
