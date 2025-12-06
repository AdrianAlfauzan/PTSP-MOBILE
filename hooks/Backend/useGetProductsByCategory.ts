// hooks/Backend/useGetProductsByCategory.ts
import { useEffect, useState, ReactNode } from 'react';

// OUR INTERFACES
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

// OUR LIBRARIES
import { productList } from '@/lib/data/productList';
import { db } from '@/lib/firebase';

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

        // ========== HANYA KATEGORI BIASA SAJA ==============
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
