import { useState } from 'react';
import { router } from 'expo-router';

// OUR INTERFACES
import {
  ProductDataBackendProps,
  ProductType,
} from '@/interfaces/product/productDataBackendProps';

// OUR UTILS
import { showAlertMessage } from '@/utils/showAlertMessage';

// OUR LIBRARIES
import { db, firebaseAuth } from '@/lib/firebase';

type ProductDataForCart = ProductDataBackendProps;

export const useAddToCart = () => {
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);

  const addToCart = async (
    product: ProductDataForCart,
    receivedProductType: ProductType
  ) => {
    setLoadingAddToCart(true);
    const user = firebaseAuth.currentUser;

    if (!user) {
      showAlertMessage(
        'Login Diperlukan',
        'Anda harus login untuk menambahkan produk ke keranjang.',
        'warning'
      );
      router.push('/screens/loginScreen');
      setLoadingAddToCart(false);
      return;
    }

    // ===============================
    // 1. Tentukan tipe produk asli
    // ===============================
    let lowerType = receivedProductType?.toLowerCase();

    // Jika produk adalah TOP → tentukan tipe asli berdasarkan Pemilik
    if (product.Status === 'Top') {
      if (product.Pemilik?.toLowerCase() === 'informasi') {
        lowerType = 'informasi';
      } else {
        lowerType = 'jasa';
      }
    }

    // ===============================
    // 2. Validasi tipe
    // ===============================
    if (!lowerType || (lowerType !== 'informasi' && lowerType !== 'jasa')) {
      console.error('❌ INVALID PRODUCT TYPE:', lowerType);
      showAlertMessage(
        'Error',
        'Tipe produk tidak valid. Tidak dapat menambahkan ke keranjang.'
      );
      setLoadingAddToCart(false);
      return;
    }

    // ===============================
    // 3. Tentukan field
    // ===============================
    const collectionName = lowerType;
    const idField = lowerType === 'informasi' ? 'ID_Informasi' : 'ID_Jasa';
    const typeField = lowerType.charAt(0).toUpperCase() + lowerType.slice(1); // Informasi / Jasa

    const cartCollectionRef = db.collection('keranjang');
    const userCartDocRef = cartCollectionRef.doc(user.uid);

    try {
      // Ambil produk dari koleksi asli
      const productRef = db.collection(collectionName).doc(product.id);
      const productSnap = await productRef.get();

      if (!productSnap.exists()) {
        showAlertMessage(
          'Produk Tidak Ditemukan',
          'Maaf, produk ini tidak lagi tersedia di database.'
        );
        return;
      }

      const productRawData = productSnap.data();
      if (!productRawData) {
        showAlertMessage('Error', 'Data produk tidak ditemukan.');
        return;
      }

      const productData: ProductDataBackendProps = {
        id: productSnap.id,
        ...productRawData,
      } as ProductDataBackendProps;

      // ===============================
      // 4. Payload item baru
      // ===============================
      const newItemPayload = {
        Harga: productData.Harga,
        [idField]: productData.id,
        Kuantitas: 1,
        Nama: productData.Nama,
        Pemilik: productData.Pemilik,
        Total_Harga: productData.Harga,
      };

      // ===============================
      // 5. Ambil keranjang user
      // ===============================
      const userCartDoc = await userCartDocRef.get();

      if (userCartDoc.exists()) {
        const currentCart = userCartDoc.data();
        const currentTypeArray = currentCart?.[typeField] || [];

        // Cek apakah produk sudah ada
        const existingProductIndex = currentTypeArray.findIndex(
          (item: any) => item[idField] === productData.id
        );

        if (existingProductIndex !== -1) {
          // Update kuantitas
          const updatedQty =
            currentTypeArray[existingProductIndex].Kuantitas + 1;
          const updatedTotal = updatedQty * productData.Harga;

          const updatedTypeArray = currentTypeArray.map(
            (item: any, idx: number) =>
              idx === existingProductIndex
                ? { ...item, Kuantitas: updatedQty, Total_Harga: updatedTotal }
                : item
          );

          await userCartDocRef.update({
            [typeField]: updatedTypeArray,
          });

          showAlertMessage(
            'Berhasil',
            'Kuantitas produk di keranjang diperbarui!',
            'success'
          );
        } else {
          // Tambahkan produk baru
          await userCartDocRef.update({
            [typeField]: [...currentTypeArray, newItemPayload],
          });

          showAlertMessage(
            'Berhasil',
            'Produk berhasil ditambahkan ke keranjang!',
            'success'
          );
        }
      } else {
        // Keranjang user belum ada → buat baru
        await userCartDocRef.set({
          [typeField]: [newItemPayload],
        });

        showAlertMessage(
          'Berhasil',
          'Produk berhasil ditambahkan ke keranjang!',
          'success'
        );
      }
    } catch (error: any) {
      console.error('Gagal menambahkan ke keranjang:', error);
      showAlertMessage(
        'Error',
        `Gagal menambahkan produk ke keranjang. ${error.message || ''}`
      );
    } finally {
      setLoadingAddToCart(false);
    }
  };

  return { loadingAddToCart, addToCart };
};
