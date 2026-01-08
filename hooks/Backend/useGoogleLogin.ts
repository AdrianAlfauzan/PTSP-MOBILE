import { useState } from 'react';
import { useRouter } from 'expo-router';

// OUR LIBRARIES
import {
  db,
  firebaseAuth,
  getGoogleCredential,
  GoogleSignin,
  statusCodes,
} from '@/lib/firebase';
import '@/lib/auth/googleConfig';

// OUR HOOKS
import { useInternetStatusContext } from '@/context/InternetStatusContext';

// OUR UTILS
import { showAlertMessage } from '@/utils/showAlertMessage';

export const useGoogleLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isConnected } = useInternetStatusContext();

  // Cek apakah user sudah terdaftar di Firestore
  const checkUserRegistration = async (uid: string) => {
    const peroranganRef = db.collection('perorangan').doc(uid);
    const perusahaanRef = db.collection('perusahaan').doc(uid);

    const [peroranganDoc, perusahaanDoc] = await Promise.all([
      peroranganRef.get(),
      perusahaanRef.get(),
    ]);

    if (peroranganDoc.exists()) return 'perorangan';
    if (perusahaanDoc.exists()) return 'perusahaan';
    return null;
  };

  const signIn = async () => {
    try {
      // Cek koneksi internet
      if (!isConnected) {
        await showAlertMessage(
          'Tidak Ada Koneksi Internet',
          'Periksa Wi-Fi atau Data Seluler Anda sebelum login.',
          'error'
        );
        return;
      }

      setLoading(true);

      // Cek Google Play Services (WAJIB untuk Android)
      try {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
        console.log('✅ Google Play Services available');
      } catch (playServicesError: any) {
        console.error('❌ Google Play Services error:', playServicesError);
        await showAlertMessage(
          'Google Play Services Diperlukan',
          'Aplikasi membutuhkan Google Play Services untuk login. Pastikan sudah terinstall dan update.',
          'error'
        );
        return;
      }

      console.log('🔧 Starting Google Sign-In...');

      // Step 1: Google Sign-In
      const signInResult = await GoogleSignin.signIn();

      if (!signInResult || signInResult.type === 'cancelled') {
        console.log('❎ Login dibatalkan oleh pengguna.');
        return;
      }

      // Handle response structure - versi baru library
      let userEmail = 'Unknown';
      let idTokenFromGoogle: string | null = null;

      // Cek struktur response yang berbeda
      if (signInResult.data) {
        // Versi baru: signInResult.data.user & signInResult.data.idToken
        userEmail = signInResult.data.user?.email || 'No email';
        idTokenFromGoogle = signInResult.data.idToken;
      } else if ((signInResult as any).user) {
        // Versi lama: signInResult.user langsung
        userEmail = (signInResult as any).user?.email || 'No email';
      }

      console.log('✅ Google Sign-In successful:', userEmail);

      // Step 2: Get ID Token - cara yang lebih reliable
      let idToken = idTokenFromGoogle;

      // Jika idToken tidak ada di response, ambil dari getTokens()
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }

      if (!idToken) {
        throw new Error('ID Token tidak ditemukan setelah login Google.');
      }

      console.log('🔑 Got ID token, creating credential...');

      // Step 3: Create Firebase Credential
      const credential = getGoogleCredential(idToken);

      // Step 4: Sign in to Firebase
      const userCredential =
        await firebaseAuth.signInWithCredential(credential);
      const firebaseUser = userCredential.user;

      console.log('🔥 Firebase login successful:', firebaseUser.email);

      // Step 5: Cek user di Firestore
      const registrationStatus = await checkUserRegistration(firebaseUser.uid);

      if (
        registrationStatus === 'perorangan' ||
        registrationStatus === 'perusahaan'
      ) {
        // Ambil nama lengkap dari dokumen
        const docRef = db.collection(registrationStatus).doc(firebaseUser.uid);
        const docSnap = await docRef.get();
        const fullName =
          docSnap.exists() && docSnap.data()?.nama_lengkap
            ? docSnap.data()?.nama_lengkap
            : (firebaseUser.displayName ?? 'Pengguna');

        await showAlertMessage(
          'Berhasil Login!',
          `Selamat datang kembali, ${fullName}`,
          'success'
        );

        router.replace('/(tabs)/home');
      } else {
        await showAlertMessage(
          'Akun Baru Ditemukan',
          'Silakan lengkapi data registrasi Anda terlebih dahulu.',
          'warning'
        );
        router.replace('/screens/registerScreen');
      }
    } catch (error: any) {
      console.error('❌ Login gagal DETAIL:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });

      // Handle error lebih spesifik
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('❎ User membatalkan login.');
        return;
      }

      if (error.code === statusCodes.IN_PROGRESS) {
        console.log('🔄 Login sedang diproses...');
        return;
      }

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        await showAlertMessage(
          'Google Play Services Tidak Tersedia',
          'Install atau update Google Play Services terlebih dahulu.',
          'error'
        );
        return;
      }

      // Error umum
      await showAlertMessage(
        'Login Gagal',
        error?.message ?? 'Terjadi kesalahan saat login. Coba lagi.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading };
};
