// useGoogleLogin.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';

// OUR LIBRARIES
import {
  db,
  firebaseAuth,
  GoogleAuthProvider,
  GoogleSignin,
  statusCodes,
} from '@/lib/firebase';
import { configureGoogleSignIn } from '@/lib/auth/googleConfig';

// OUR HOOKS
import { useInternetStatusContext } from '@/context/InternetStatusContext';

// OUR UTILS
import { showAlertMessage } from '@/utils/showAlertMessage';

export const useGoogleLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isConnected } = useInternetStatusContext();

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
      if (!isConnected) {
        await showAlertMessage(
          'Tidak Ada Koneksi Internet',
          'Periksa Wi-Fi atau Data Seluler Anda sebelum login.',
          'error'
        );
        return;
      }

      setLoading(true);

      await showAlertMessage(
        'Memproses Login...',
        'Mohon tunggu sebentar',
        'warning',
        { duration: 1000 }
      );

      // Konfigurasi Google Sign-In
      const isConfigured = configureGoogleSignIn();
      if (!isConfigured) {
        throw new Error('Gagal mengkonfigurasi Google Sign-In');
      }

      // Cek Google Play Services untuk Android
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Sign out dulu untuk bersihkan cache
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.log('Sign out tidak diperlukan:', error);
      }

      // Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      if (!userInfo || userInfo.type === 'cancelled') {
        console.log('Login dibatalkan');
        return;
      }

      // Get ID Token
      const tokens = await GoogleSignin.getTokens();
      if (!tokens.idToken) {
        throw new Error('ID Token tidak ditemukan');
      }

      // PERBAIKAN DI SINI: credential BUKAN creatential
      const credential = GoogleAuthProvider.credential(tokens.idToken);

      // Firebase Sign-In
      const userCredential =
        await firebaseAuth.signInWithCredential(credential);
      const user = userCredential.user;

      console.log('Login Firebase berhasil:', user.email);

      // Cek registrasi
      const registrationStatus = await checkUserRegistration(user.uid);

      if (registrationStatus) {
        const docRef = db.collection(registrationStatus).doc(user.uid);
        const docSnap = await docRef.get();
        const fullName =
          docSnap.exists() && docSnap.data()?.nama_lengkap
            ? docSnap.data()?.nama_lengkap
            : (user.displayName ?? 'Pengguna');

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
      console.error('Login gagal:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      if (error.code === statusCodes.IN_PROGRESS) {
        await showAlertMessage(
          'Login Sedang Berlangsung',
          'Silakan tunggu proses login sebelumnya selesai.',
          'warning'
        );
        return;
      }

      await showAlertMessage(
        'Login Gagal',
        error?.message ?? 'Terjadi kesalahan saat login. Silakan coba lagi.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading };
};
