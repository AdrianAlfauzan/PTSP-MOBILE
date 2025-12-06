// hooks/Backend/useGetTopProducts.ts
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

export const useGetTopProducts = () => {
  const [topProducts, setTopProducts] = useState<ProductDataBackendProps[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        setLoadingTop(true);

        const result: ProductDataBackendProps[] = [];

        const infoSnap = await db
          .collection('informasi')
          .where('Status', '==', 'Top')
          .get();

        infoSnap.forEach((doc) =>
          result.push({ id: doc.id, ...(doc.data() as any) })
        );

        const jasaSnap = await db
          .collection('jasa')
          .where('Status', '==', 'Top')
          .get();

        jasaSnap.forEach((doc) =>
          result.push({ id: doc.id, ...(doc.data() as any) })
        );

        setTopProducts(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTop(false);
      }
    };

    fetchTop();
  }, []);

  return { topProducts, loadingTop };
};
