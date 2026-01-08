// lib/auth/googleConfig.ts
import { GoogleSignin } from '@/lib/firebase';
import Constants from 'expo-constants';

// Panggil fungsi ini di awal aplikasi
export const configureGoogleSignIn = () => {
  const webClientId = Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID;

  console.log('🔧 Configuring Google Sign-In...');
  console.log('🔧 Web Client ID:', webClientId);

  if (!webClientId) {
    console.error('❌ GOOGLE_WEB_CLIENT_ID tidak ditemukan!');
    return false;
  }

  try {
    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
      scopes: ['profile', 'email'],
      forceCodeForRefreshToken: false,
      // Tambahkan untuk Android
      profileImageSize: 120,
    });

    console.log('✅ Google Sign-In configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Error configuring Google Sign-In:', error);
    return false;
  }
};

// Konfigurasi saat file di-import
configureGoogleSignIn();
