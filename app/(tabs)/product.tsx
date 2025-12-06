// screens/Product.tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// COMPONENTS
import AnimatedTabBar from '@/components/animatedTabBar';
import { ProductSection } from '@/components/Product/ProductSection';
import ProductPrioritySection from '@/components/Product/ProductPrioritySection';

// CONSTANTS
import { productTabs } from '@/constants/productTabs';

// HOOKS
import { useTabAnimation } from '@/hooks/Frontend/useAnimatedTab/useTabAnimation';
import { useSkeletonForTab } from '@/hooks/Frontend/skeletons/useSkeletonForTab';
import { useAddToCart } from '@/hooks/Backend/useAddToCart';

// OUR LIBRARIES
import { productList } from '@/lib/data/productList';

// CONTEXT
import { useSearch } from '@/context/SearchContext';

// INTERFACES
import {
  ProductDataBackendProps,
  ProductType,
} from '@/interfaces/product/productDataBackendProps';

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
  const { addToCart, loadingAddToCart } = useAddToCart();

  // Skeleton loading
  const showSkeleton = useSkeletonForTab(activeTab);

  // ================= FRONTEND FILTERING ==================
  const filteredByCategory = useMemo(() => {
    return activeTab === 'Semua'
      ? productList
      : productList.filter((item) => item.category === activeTab);
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

  const informasiProducts = useMemo(() => {
    return searchedProducts.filter((item) => item.category === 'Informasi');
  }, [searchedProducts]);

  const jasaProducts = useMemo(() => {
    return searchedProducts.filter((item) => item.category === 'Jasa');
  }, [searchedProducts]);

  // Handler khusus untuk produk Prioritas
  const handleAddTopProductToCart = (item: ProductDataBackendProps) => {
    const type: ProductType = (item.Tipe ||
      (item.Status === 'Top' ? 'Top' : 'Informasi')) as ProductType;
    addToCart(item, type);
  };
  return (
    <View className="flex-1">
      {/* TAB */}
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

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="bg-[#A7CBE5]"
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH INFO */}
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

        {/* ====================== SEMUA ====================== */}
        {activeTab === 'Semua' && (
          <>
            <ProductSection
              title="Produk Informasi"
              products={informasiProducts}
              showSkeleton={showSkeleton}
              router={router}
            />

            <ProductSection
              title="Produk Jasa"
              products={jasaProducts}
              showSkeleton={showSkeleton}
              router={router}
            />
          </>
        )}

        {/* ====================== INFORMASI ====================== */}
        {activeTab === 'Informasi' && (
          <ProductSection
            title="Produk Informasi"
            products={informasiProducts}
            showSkeleton={showSkeleton}
            router={router}
          />
        )}

        {/* ====================== JASA ====================== */}
        {activeTab === 'Jasa' && (
          <ProductSection
            title="Produk Jasa"
            products={jasaProducts}
            showSkeleton={showSkeleton}
            router={router}
          />
        )}

        {/* ====================== TOP PRODUCTS (BACKEND) ====================== */}
        {activeTab === 'Prioritas' && (
          <ProductPrioritySection
            onAddToCart={handleAddTopProductToCart}
            loadingAddToCart={loadingAddToCart}
          />
        )}
      </ScrollView>
    </View>
  );
}
