// hooks/Backend/useGetProductsByCategory.ts
import { useEffect, useState, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { productList } from '@/lib/data/productList';
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

export const useGetProductsByCategory = (category: string) => {
  const [products, setProducts] = useState<ProductDataBackendProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [icon, setIcon] = useState<ReactNode>(null);
  const [ownerName, setOwnerName] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const lower = category.toLowerCase();

        // ========== PRIORITAS & TERSEDIA ==============
        let statusToFetch: string | null =
          lower === 'prioritas'
            ? 'Top'
            : lower === 'tersedia'
              ? 'Tersedia'
              : null;

        if (statusToFetch) {
          let result: ProductDataBackendProps[] = [];

          // Ambil dari informasi
          const infoSnap = await db
            .collection('informasi')
            .where('Status', '==', statusToFetch)
            .get();

          infoSnap.forEach((doc) =>
            result.push({ id: doc.id, ...(doc.data() as any) })
          );

          // Ambil dari jasa
          const jasaSnap = await db
            .collection('jasa')
            .where('Status', '==', statusToFetch)
            .get();

          jasaSnap.forEach((doc) =>
            result.push({ id: doc.id, ...(doc.data() as any) })
          );

          setProducts(result);

          // Set icon & title (ambil dari productList berdasarkan Pemilik pertama)
          const owner = result.length > 0 ? result[0].Pemilik : '';

          const productInfo = productList.find(
            (p) => p.paramCategory.split('_')[1] === owner
          );

          setIcon(productInfo?.icon || null);
          setOwnerName(productInfo?.title || owner || '');

          setLoading(false);
          return;
        }

        // ========== KATEGORI BIASA ==============
        const parts = category.split('_');
        if (parts.length >= 2) {
          const type = parts[0].toLowerCase();
          const owner = parts.slice(1).join('_');

          const col = type === 'informasi' ? 'informasi' : 'jasa';

          const snap = await db
            .collection(col)
            .where('Pemilik', '==', owner)
            .get();

          const fetched = snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as any),
          }));

          setProducts(fetched);

          const productInfo = productList.find(
            (p) => p.paramCategory.split('_')[1] === owner
          );

          setIcon(productInfo?.icon || null);
          setOwnerName(productInfo?.title || owner);
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error, icon, ownerName };
};
