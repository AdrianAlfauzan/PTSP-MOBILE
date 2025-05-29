import { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useGoogleLogin = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "829294397794-49j4vv22ji3fe4pv7ubreknfclbt82sa.apps.googleusercontent.com", // ambil dari Firebase Console
      offlineAccess: true,
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Mulai proses login
      // const userInfo = await GoogleSignin.signIn();

      // Ambil token untuk autentikasi Firebase
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error("ID Token tidak ditemukan. Login dibatalkan.");
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);

      return userCredential.user;
    } catch (error) {
      console.error("Google Sign-In Error: ", JSON.stringify(error, null, 2));
      throw error;
    }
  };

  return { signInWithGoogle };
};
