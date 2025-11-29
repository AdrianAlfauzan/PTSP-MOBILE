// hooks/useAIProducts.ts
import { useState, useEffect } from 'react';

// OUR HOOKS
import { useGetProductsByCategory } from '@/hooks/Backend/useGetProductsByCategory';

// OUR INTERFACES
import { ProductDataBackendProps } from '@/interfaces/product/productDataBackendProps';

export const useAIProducts = () => {
  const [allProducts, setAllProducts] = useState<ProductDataBackendProps[]>([]);

  const { products: topProducts, loading: loadingTop } =
    useGetProductsByCategory('prioritas');
  const { products: availableProducts, loading: loadingAvailable } =
    useGetProductsByCategory('tersedia');

  useEffect(() => {
    if (!loadingTop && !loadingAvailable) {
      setAllProducts([...topProducts, ...availableProducts]);
    }
  }, [loadingTop, loadingAvailable, topProducts, availableProducts]);

  const loading = loadingTop || loadingAvailable;

  return {
    products: allProducts,
    loading,
    topProducts,
    availableProducts,
    hasProducts: allProducts.length > 0,
  };
};
