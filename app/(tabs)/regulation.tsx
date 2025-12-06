import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import ImageZoom from 'react-native-image-pan-zoom';
import Entypo from '@expo/vector-icons/Entypo';
import { WrapperSkeletonRegulationTab } from '@/components/skeletons/wrapperSkeletonRegulationTab';
import { useSkeletonForTab } from '@/hooks/Frontend/skeletons/useSkeletonForTab';

const { width, height: screenHeight } = Dimensions.get('window');

export default function Regulation() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const ZoomAny = ImageZoom as unknown as React.ComponentType<any>;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const showSkeleton = useSkeletonForTab();

  const handleNext = () => {
    if (activeIndex < selectedImages.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      setActiveIndex(prevIndex);
      scrollRef.current?.scrollTo({ x: width * prevIndex, animated: true });
    }
  };

  const openModal = (images: any[]) => {
    setSelectedImages(images);
    setActiveIndex(0);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImages([]);
  };

  if (showSkeleton) {
    return <WrapperSkeletonRegulationTab />;
  }

  return (
    <View className="flex-1 bg-[#F0F7FF]">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Regulasi Pelayanan Header */}
        <Text
          style={{ fontFamily: 'LexBold' }}
          className="mb-5 text-2xl text-gray-800"
        >
          Regulasi Pelayanan
        </Text>

        {/* Regulation Cards */}
        <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Text
            style={{ fontFamily: 'LexBold' }}
            className="mb-4 text-lg text-gray-800"
          >
            Regulasi Pelayanan
          </Text>

          {[
            {
              title: 'Syarat dan Tata Cara Pengenaan Tarif Rp.0,00...',
              ref: 'Perka No. 12 Tahun 2019',
            },
            {
              title: 'Produk dan Tarif sesuai PP No. 47 Tahun 2018...',
              ref: 'PP No. 47 Tahun 2018',
            },
            {
              title: 'Peraturan PTSP sesuai Perka No. 01 Tahun 2019...',
              ref: 'Perka No. 01 Tahun 2019',
            },
            {
              title: 'Manual PTSP BMKG untuk Pelanggan...',
              ref: 'Manual Alur Layanan PTSP BMKG',
            },
          ].map((item, idx) => (
            <View key={idx} className="mb-3 last:mb-0">
              <Text
                style={{ fontFamily: 'LexRegular' }}
                className="mb-2 text-base text-gray-700"
              >
                {item.title}
              </Text>
              <View className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                <Text
                  style={{ fontFamily: 'LexRegular' }}
                  className="text-sm text-blue-700"
                >
                  Sesuai dengan:
                </Text>
                <Text
                  style={{ fontFamily: 'LexBold' }}
                  className="mt-1 text-sm text-[#72C02C]"
                >
                  {item.ref}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Image Cards */}
        <View className="my-6 flex-row justify-between gap-3">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              openModal([require('@/assets/images/Regulation/AlurLayanan.jpg')])
            }
            className="flex-1"
          >
            <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
              <Image
                source={require('@/assets/images/Regulation/AlurLayanan.jpg')}
                className="h-36 w-full object-cover"
                resizeMode="cover"
              />
              <View className="items-center p-3">
                <Text
                  style={{ fontFamily: 'LexBold' }}
                  className="text-base text-gray-800"
                >
                  Alur Layanan
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              openModal([
                require('@/assets/images/Regulation/StandarLayanan1.jpg'),
                require('@/assets/images/Regulation/StandarLayanan2.jpg'),
              ])
            }
            className="flex-1"
          >
            <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
              <Image
                source={require('@/assets/images/Regulation/StandarLayanan1.jpg')}
                className="h-36 w-full object-cover"
                resizeMode="cover"
              />
              <View className="items-center p-3">
                <Text
                  style={{ fontFamily: 'LexBold' }}
                  className="text-base text-gray-800"
                >
                  Standar Layanan
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tarif Pelayanan Section */}
        <Text
          style={{ fontFamily: 'LexBold' }}
          className="mb-5 mt-6 text-2xl text-gray-800"
        >
          Tarif Pelayanan
        </Text>

        {/* Informasi MKG */}
        <View className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <View className="mb-4 flex-row items-center gap-2">
            <Text
              style={{ fontFamily: 'LexBold' }}
              className="text-lg text-gray-800"
            >
              I.
            </Text>
            <Text
              style={{ fontFamily: 'LexBold' }}
              className="flex-1 text-lg text-gray-800"
            >
              Informasi Meteorologi, Klimatologi, dan Geofisika
            </Text>
          </View>
          <View className="gap-3 px-2">
            <TouchableOpacity
              className="items-center rounded-lg bg-[#72C02C] py-3"
              onPress={() => router.push('/screens/generalInformationRates')}
            >
              <Text
                style={{ fontFamily: 'LexBold' }}
                className="text-base text-white"
              >
                Informasi Umum
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center rounded-lg bg-[#1275BA] py-3"
              onPress={() => router.push('/screens/specialInformationRates')}
            >
              <Text
                style={{ fontFamily: 'LexBold' }}
                className="text-base text-white"
              >
                Informasi Khusus Sesuai Permintaan
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-3">
            <Text
              style={{ fontFamily: 'LexRegular' }}
              className="text-xs text-gray-600"
            >
              Catatan: Ketuk tombol di atas untuk melihat tarif layanan
            </Text>
          </View>
        </View>

        {/* Jasa Konsultasi */}
        <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <View className="mb-4 flex-row items-center gap-2">
            <Text
              style={{ fontFamily: 'LexBold' }}
              className="text-lg text-gray-800"
            >
              II.
            </Text>
            <Text
              style={{ fontFamily: 'LexBold' }}
              className="flex-1 text-lg text-gray-800"
            >
              Jasa Konsultasi Meteorologi, Klimatologi, dan Geofisika
            </Text>
          </View>
          <View className="gap-3 px-2">
            <TouchableOpacity
              className="items-center rounded-lg bg-[#72C02C] py-3"
              onPress={() => router.push('/screens/consultingServiceRates')}
            >
              <Text
                style={{ fontFamily: 'LexBold' }}
                className="text-base text-white"
              >
                Jasa Konsultasi
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-3">
            <Text
              style={{ fontFamily: 'LexRegular' }}
              className="text-xs text-gray-600"
            >
              Catatan: Ketuk tombol di atas untuk melihat tarif layanan
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      >
        <View className="relative flex-1 bg-black">
          {/* Close Button */}
          <Pressable
            onPress={closeModal}
            className="absolute right-5 top-10 z-10 rounded-full bg-white px-4 py-2"
          >
            <Text
              style={{ fontFamily: 'LexBold' }}
              className="text-sm text-black"
            >
              Tutup
            </Text>
          </Pressable>

          {/* Navigation Arrows */}
          {activeIndex > 0 && (
            <Pressable
              onPress={handlePrev}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3"
            >
              <Entypo name="chevron-left" size={22} color="black" />
            </Pressable>
          )}
          {activeIndex < selectedImages.length - 1 && (
            <Pressable
              onPress={handleNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3"
            >
              <Entypo name="chevron-right" size={22} color="black" />
            </Pressable>
          )}

          {/* Image Carousel */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveIndex(index);
            }}
            className="flex-1"
          >
            {selectedImages.map((img, index) => (
              <View key={index} style={{ width, height: screenHeight }}>
                <ZoomAny
                  cropWidth={width}
                  cropHeight={screenHeight}
                  imageWidth={width}
                  imageHeight={screenHeight * 0.8}
                  minScale={1}
                  maxScale={3}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={img}
                    style={{ width: width * 0.95, height: screenHeight * 0.75 }}
                    resizeMode="contain"
                  />
                </ZoomAny>
              </View>
            ))}
          </ScrollView>

          {/* Indicator Dots */}
          {selectedImages.length > 1 && (
            <View className="absolute bottom-8 left-1/2 -translate-x-1/2 transform flex-row space-x-2">
              {selectedImages.map((_, i) => (
                <View
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === activeIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
