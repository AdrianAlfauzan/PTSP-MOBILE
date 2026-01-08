import { GoogleSignin } from '@/lib/firebase';
import Constants from 'expo-constants';

// Panggil fungsi ini di awal aplikasi
export const configureGoogleSignIn = () => {
  const webClientId = Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID;

  console.log('🔧 Configuring Google Sign-In...');
  console.log('🔧 Web Client ID:', webClientId ? '***SET***' : 'MISSING');

  if (!webClientId) {
    console.error('❌ GOOGLE_WEB_CLIENT_ID tidak ditemukan!');
    console.error('❌ Cek app.config.ts dan .env file');
    return false;
  }

  try {
    GoogleSignin.configure({
      webClientId: webClientId.trim(), // Pastikan tidak ada spasi
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
const isConfigured = configureGoogleSignIn();
if (!isConfigured) {
  console.warn('⚠️ Google Sign-In configuration failed!');
}
