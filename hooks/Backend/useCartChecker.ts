import { db, firebaseAuth } from '@/lib/firebase';

export const useCheckCart = () => {
  const checkCart = async () => {
    const user = firebaseAuth.currentUser;
    if (!user) return { isEmpty: true, items: [] };

    const userCartDoc = await db.collection('keranjang').doc(user.uid).get();

    if (!userCartDoc.exists()) {
      return { isEmpty: true, items: [] };
    }

    const data = userCartDoc.data();
    const jasa = data?.Jasa || [];
    const informasi = data?.Informasi || [];

    const allItems = [...jasa, ...informasi];
    return {
      isEmpty: allItems.length === 0,
      items: allItems,
    };
  };

  return { checkCart };
};
