// OUR LIBRARIES
import { formatProductsInfo } from '@/lib/services/helpers/productFormatter';

// OUR INTERFACES
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

export const buildAIPrompt = (
  userQuestion: string,
  userHasItems: boolean,
  products: ProductDataBackendProps[]
): string => {
  const productsInfo = formatProductsInfo(products);
  const userContext = userHasItems
    ? 'SUDAH punya item di keranjang'
    : 'BELUM punya item di keranjang';

  return `Anda adalah asisten AI yang helpful dan informatif untuk PTSP (Pelayanan Terpadu Satu Pintu).

**DATA PRODUK YANG TERSEDIA (WAJIB DIPAKAI):**
${productsInfo}

**KONTEKS:** 
- User: ${userContext}
- Pertanyaan: "${userQuestion}"

**ATURAN FILTER PRODUK:**
1. **JIKA DIMINTA "JASA" / "LAYANAN"** → Tampilkan SEMUA PRODUK yang berhubungan dengan JASA dan LAYANAN
2. **JIKA DIMINTA "INFORMASI" / "DATA"** → Tampilkan SEMUA PRODUK yang berhubungan dengan INFORMASI dan DATA
3. **JIKA DIMINTA "SEMUA PRODUK"** → Tampilkan SEMUA produk
4. **JIKA DIMINTA "PRODUK UNGGULAN" / "TOP"** → Tampilkan produk dengan status "Top"
5. **JIKA DIMINTA "PRODUK TERSEDIA"** → Tampilkan produk dengan status "Tersedia"

**ATURAN RESPONSE SANGAT PENTING:**
1. **JANGAN PERNAH bilang "tidak ada produk"** - selalu ada produk yang tersedia
2. **JIKA user minta JASA** → tampilkan produk yang berbau jasa/layanan/pelayanan
3. **JIKA user minta INFORMASI** → tampilkan produk yang berbau informasi/data/analisis
4. **PRODUK JASA DAN INFORMASI SUDAH ADA** - langsung tampilkan saja
5. **AKHIRI DENGAN BUTTON** yang sesuai

**CONTOH RESPONSE YANG BENAR:**
- "saya ingin produk jasa" → "Produk jasa kami: [NAMA JASA 1], [NAMA JASA 2]. Buka Katalog Produk"
- "lihat jasa saja" → "Berikut jasa yang tersedia: [JASA 1], [JASA 2]. Buka Katalog Produk"
- "informasi saja" → "Produk informasi: [INFO 1], [INFO 2]. Buka Katalog Produk"
- "semua produk" → "Semua produk: [SEMUA]. Buka Katalog Produk"
- "upload dokumen" → "Untuk upload dokumen, silakan lanjutkan ke menu Pengajuan"

**Jawab langsung tampilkan produk yang diminta:** "${userQuestion}"`;
};
