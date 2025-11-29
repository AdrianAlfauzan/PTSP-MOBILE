import React from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';

// OUR COMPONENTS
import ButtonCustom from '@/components/buttonCustom';
import { WrapperSkeletonProductTab } from '@/components/skeletons/wrapperSkeletonProductTab';

// OUR INTERFACES
import { ProductDataPropsUI } from '@/interfaces/product/productDataFrontendProps';

interface ProductSectionProps {
  title: string;
  products: ProductDataPropsUI[];
  showSkeleton?: boolean;
  router: ReturnType<typeof useRouter>;
  
}

export const ProductSection = ({
  title,
  products,
  showSkeleton = false,
  router,
}: ProductSectionProps) => {
  if (showSkeleton) {
    return <WrapperSkeletonProductTab />;
  }

  return (
    <View>
      <Text className="self-center py-1 pt-5 text-[20px] font-bold">
        {title}
      </Text>

      {products.map((item, idx) => (
        <View
          key={idx}
          className="mt-3 h-auto w-[74%] self-center rounded-[15px] border-2 border-b-[4px] border-x-black/5 border-b-black/10 border-t-black/5 bg-white p-3.5"
        >
          <View className="h-[125px] w-full shadow-xl">
            <Image
              source={require('@/assets/images/ProductScreen/bg-icon.png')}
              className="h-full w-full rounded-[20px]"
            />
            <View className="absolute inset-0 items-center justify-center">
              {item.icon}
            </View>
          </View>

          <Text className="py-2 text-[20px] font-bold">{item.title}</Text>
          <Text className="pb-4 text-[12px]">{item.desc}</Text>

          <ButtonCustom
            text="Lihat Produk"
            classNameContainer="bg-[#1475BA] px-6 py-2 rounded-lg"
            textClassName="text-sm text-white"
            onPress={() =>
              router.push({
                pathname: item.pathname,
                params: { category: item.paramCategory },
              })
            }
          />
        </View>
      ))}
    </View>
  );
};
