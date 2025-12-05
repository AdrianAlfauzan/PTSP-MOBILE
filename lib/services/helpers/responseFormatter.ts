// OUR INTERFACES
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

export const formatAIResponse = (
  aiText: string,
  userQuestion: string,
  userHasItems: boolean,
  isAboutProducts: boolean,
  isAboutSubmission: boolean,
  products: ProductDataBackendProps[]
): string => {
  // ✅ DEBUG: Lihat apa yang dideteksi
  console.log('🔍 DEBUG INTENT:');
  console.log('- Question:', userQuestion);
  console.log('- isAboutProducts:', isAboutProducts);
  console.log('- isAboutSubmission:', isAboutSubmission);
  console.log('- userHasItems:', userHasItems);

  // Handle AI rejection responses
  const enhancedResponse = handleAIRejection(aiText);

  // Add products CTA if about products
  if (isAboutProducts) {
    return `${enhancedResponse}\n\n🛍️ **Ingin lihat detail lengkap?**\n📱 **Buka Katalog Produk** untuk informasi lebih lanjut!`;
  }

  // Handle submission intent - PERBAIKAN DI SINI!
  if (isAboutSubmission && !isAboutProducts) {
    return handleSubmissionIntent(enhancedResponse, userHasItems);
  }

  return enhancedResponse;
};

const handleAIRejection = (aiText: string): string => {
  if (aiText.includes('Maaf') && aiText.includes('hanya membantu')) {
    return `Tentu! Kami memiliki berbagai layanan PTSP yang bisa membantu Anda. Ada yang spesifik yang ingin Anda tanyakan?`;
  }
  return aiText;
};

const handleSubmissionIntent = (
  aiText: string,
  userHasItems: boolean
): string => {
  // ✅ PERBAIKAN: Hanya kasih button pengajuan JIKA ada cart items
  if (userHasItems) {
    return `${aiText}\n\n📋 **Anda sudah memiliki pesanan di keranjang!**\n🎯 **Silakan lanjutkan ke menu Pengajuan**`;
  } else {
    // ❌ Jika tidak ada cart items, kasih button produk
    return `${aiText}\n\n⚠️ **Anda belum memiliki pesanan di keranjang**\n🛒 **Buka Katalog Produk untuk melihat layanan**`;
  }
};
