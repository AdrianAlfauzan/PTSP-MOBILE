// googleConfig.ts
import { GoogleSignin } from '@/lib/firebase';
import Constants from 'expo-constants';

export const configureGoogleSignIn = () => {
  const webClientId = Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID;

  if (!webClientId) {
    console.error('GOOGLE_WEB_CLIENT_ID tidak ditemukan');
    return false;
  }

  try {
    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
      forceCodeForRefreshToken: false,
      scopes: ['profile', 'email'],
    });

    console.log('Google Sign-In configured');
    return true;
  } catch (error) {
    console.error('Error configuring Google Sign-In:', error);
    return false;
  }
};
