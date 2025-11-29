// context/InternetStatusContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Network from 'expo-network';
import { showAlertMessage } from '@/utils/showAlertMessage';

interface InternetStatus {
  isConnected: boolean;
  networkType: string | null;
  justReconnected: boolean; // tambahan flag
}

const InternetStatusContext = createContext<InternetStatus>({
  isConnected: true,
  networkType: null,
  justReconnected: false,
});

export const InternetStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<InternetStatus>({
    isConnected: true,
    networkType: null,
    justReconnected: false,
  });

  const prevStatus = useRef<boolean | null>(null);

  const checkInternet = async () => {
    try {
      const net = await Network.getNetworkStateAsync();
      const connected = !!(net.isConnected && net.isInternetReachable);

      // Cek perubahan status
      let reconnected = false;
      if (prevStatus.current !== null && prevStatus.current !== connected) {
        if (!connected)
          showAlertMessage(
            'Tidak ada koneksi internet',
            'Periksa Wi-Fi atau Data seluler',
            'error'
          );
        else {
          showAlertMessage('Koneksi berhasil kembali', undefined, 'success');
          reconnected = true;
        }
      }

      prevStatus.current = connected;

      setStatus({
        isConnected: connected,
        networkType: net.type?.toString() ?? null,
        justReconnected: reconnected,
      });
    } catch (error) {
      console.warn('Gagal mengecek koneksi:', error);
      setStatus({ isConnected: false, networkType: null, justReconnected: false });
    }
  };

  useEffect(() => {
    checkInternet();
    const interval = setInterval(checkInternet, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InternetStatusContext.Provider value={status}>
      {children}
    </InternetStatusContext.Provider>
  );
};

export const useInternetStatusContext = () => useContext(InternetStatusContext);
