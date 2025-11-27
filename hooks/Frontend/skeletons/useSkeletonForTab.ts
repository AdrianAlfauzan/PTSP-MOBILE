import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useSkeletonForTab = (
  activeTab: string,
  duration: number = 500
) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Reset skeleton ketika screen focus
  useFocusEffect(
    useCallback(() => {
      setShowSkeleton(true);
      const timer = setTimeout(() => setShowSkeleton(false), duration);
      return () => clearTimeout(timer);
    }, [duration])
  );

  // Reset skeleton ketika tab berubah
  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => setShowSkeleton(false), duration);
    return () => clearTimeout(timer);
  }, [activeTab, duration]);

  return showSkeleton;
};
