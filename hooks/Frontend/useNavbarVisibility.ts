import { usePathname } from 'expo-router';

export default function useNavbarVisibility() {
  const pathname = usePathname();

  // Aturan tombol Shop
  const hideShopPages = [
    '/home',
    '/regulation',
    '/faq',
    '/screens/loginScreen',
    '/screens/registerScreen',
    '/screens/cartOrderScreen',
    '/screens/chatScreen',
    '/screens/roomChatScreen',
  ];

  // Aturan tombol Chat
  const hideChatPages = [
    '/profile',
    '/screens/loginScreen',
    '/screens/registerScreen',
    '/screens/chatScreen',
    '/screens/roomChatScreen',
  ];

  // Aturan hide navbar
  const hideNavbarPages = [
    '/profile',
    '/screens/splashScreen',
    '/screens/welcomeScreen',
    '/screens/loginScreen',
    '/screens/registerScreen',
    '/screens/companyRegisterScreen',
    '/screens/individualRegisterScreen',
    '/screens/successOrderScreen',
  ];

  return {
    pathname,
    showShopButton: !hideShopPages.some((page) => pathname?.includes(page)),
    showChatButton: !hideChatPages.some((page) => pathname?.includes(page)),
    showNavbar: !hideNavbarPages.some((page) => pathname?.includes(page)),
  };
}
