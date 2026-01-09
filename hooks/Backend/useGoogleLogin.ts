// useGoogleLogin.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native'; // INI DIBUTUHKAN

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

      // Alert loading sementara
      await showAlertMessage(
        'Memproses Login...',
        'Mohon tunggu sebentar',
        'warning',
        { duration: 3000 }
      );

      // Step 1: Konfigurasi ulang Google Sign-In sebelum login
      const isConfigured = configureGoogleSignIn();
      if (!isConfigured) {
        throw new Error('Gagal mengkonfigurasi Google Sign-In');
      }

      // Delay supaya terlihat loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Cek apakah Google Play Services tersedia (Android only)
      if (Platform.OS === 'android') {
        const hasPlayServices = await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });

        if (!hasPlayServices) {
          throw new Error('Google Play Services tidak tersedia');
        }
      }

      // Step 3: Sign Out terlebih dahulu untuk menghindari cache issue
      try {
        await GoogleSignin.signOut();
        console.log('✅ Signed out from Google');
      } catch {
        // Ignore sign out errors
        console.log('ℹ️ Sign out not necessary');
      }

      // Step 4: Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      if (!userInfo || userInfo.type === 'cancelled') {
        console.log('❎ Login dibatalkan oleh pengguna.');
        return;
      }

      // Step 5: Get ID Token
      const tokens = await GoogleSignin.getTokens();
      if (!tokens.idToken) {
        throw new Error('ID Token tidak ditemukan setelah login Google.');
      }

      // Step 6: Firebase Sign-In
      const credential = GoogleAuthProvider.credential(tokens.idToken);
      const userCredential =
        await firebaseAuth.signInWithCredential(credential);
      const user = userCredential.user;

      console.log('🔥 Login Firebase berhasil:', user.email);

      // Step 7: Cek user di Firestore
      const registrationStatus = await checkUserRegistration(user.uid);

      if (
        registrationStatus === 'perorangan' ||
        registrationStatus === 'perusahaan'
      ) {
        // Ambil nama lengkap dari dokumen
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
      console.error('❌ Login gagal:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('❎ User membatalkan login.');
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

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        await showAlertMessage(
          'Google Play Services Tidak Tersedia',
          'Pastikan Google Play Services terinstall dan update.',
          'error'
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
