import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

export const formatProductsInfo = (
  products: ProductDataBackendProps[]
): string => {
  if (products.length === 0) {
    return '**📊 INFORMASI PRODUK:**\n\nSaat ini sedang tidak ada produk yang tersedia. Silakan buka **Katalog Produk** untuk melihat layanan yang tersedia.';
  }

  console.log(`📦 Formatting ${products.length} products`);

  // Group by status
  const topProducts = products.filter((p) => p.Status === 'Top');
  const availableProducts = products.filter((p) => p.Status === 'Tersedia');
  const otherProducts = products.filter(
    (p) => p.Status !== 'Top' && p.Status !== 'Tersedia'
  );

  let productsInfo = '';

  if (topProducts.length > 0) {
    productsInfo += `**⭐ PRODUK UNGGULAN:**\n\n${topProducts
      .map(
        (product) =>
          `🎯 **${product.Nama}**\n💵 **Harga:** Rp ${product.Harga?.toLocaleString('id-ID') || '0'}\n📝 **Deskripsi:** ${product.Deskripsi}\n🔸 **Kategori:** ${product.Pemilik}`
      )
      .join('\n\n')}\n\n`;
  }

  if (availableProducts.length > 0) {
    productsInfo += `**📦 PRODUK TERSEDIA:**\n\n${availableProducts
      .map(
        (product) =>
          `📋 **${product.Nama}**\n💵 **Harga:** Rp ${product.Harga?.toLocaleString('id-ID') || '0'}\n📝 **Deskripsi:** ${product.Deskripsi}\n🔸 **Kategori:** ${product.Pemilik}`
      )
      .join('\n\n')}\n\n`;
  }

  if (otherProducts.length > 0) {
    productsInfo += `**🔧 PRODUK LAINNYA:**\n\n${otherProducts
      .map(
        (product) =>
          `⚙️ **${product.Nama}**\n💵 **Harga:** Rp ${product.Harga?.toLocaleString('id-ID') || '0'}\n📝 **Deskripsi:** ${product.Deskripsi}\n🔸 **Status:** ${product.Status}`
      )
      .join('\n\n')}`;
  }

  return `**📊 PRODUK/LAYANAN PTSP YANG TERSEDIA:**\n\n${productsInfo}`;
};
