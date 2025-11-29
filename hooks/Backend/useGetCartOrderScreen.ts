// hooks/useGetCartOrderScreen.ts
import { useEffect, useState } from 'react';
import { firebaseAuth, db } from '@/lib/firebase';

export type CartItem = {
  Nama: string;
  Harga: number;
  Kuantitas: number;
  Total_Harga: number;
  Pemilik: string;
  ID_Informasi?: string;
  ID_Jasa?: string;
};

export const useGetCartOrderScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasCartItems, setHasCartItems] = useState(false);

  useEffect(() => {
    const user = firebaseAuth.currentUser;
    if (!user) {
      setCartItems([]);
      setTotalHarga(0);
      setHasCartItems(false); // ✅ UPDATE
      setLoading(false);
      return;
    }

    const startTime = Date.now();

    const unsubscribe = db
      .collection('keranjang')
      .doc(user.uid)
      .onSnapshot((docSnap) => {
        const data = docSnap.data();
        const informasi = data?.Informasi || [];
        const jasa = data?.Jasa || [];
        const allItems = [...informasi, ...jasa];

        const total = allItems.reduce(
          (sum: number, item: CartItem) => sum + (item.Total_Harga || 0),
          0
        );

        const hasItems = allItems.length > 0; // ✅ LOGIC CHECK
        setHasCartItems(hasItems); // ✅ UPDATE STATE

        const elapsed = Date.now() - startTime;
        const delay = Math.max(800 - elapsed, 0);

        setTimeout(() => {
          setCartItems(allItems);
          setTotalHarga(total);
          setLoading(false);
        }, delay);
      });

    return () => unsubscribe();
  }, []);

  return { cartItems, totalHarga, loading, hasCartItems }; // ✅ RETURN hasCartItems
};
