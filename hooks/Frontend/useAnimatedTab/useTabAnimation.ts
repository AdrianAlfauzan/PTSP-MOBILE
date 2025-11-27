// hooks/Frontend/useAnimatedTab/useTabAnimation.ts
import { useState, useEffect, useRef } from 'react';
import { LayoutChangeEvent, Animated } from 'react-native';

// OUR INTERFACES
import {
  TabAnimationProps,
  TabAnimationHookReturn,
} from '@/interfaces/tabAnimationProps';

export function useTabAnimation<GenericType extends string>(
  tabs: readonly GenericType[],
  initialTab: GenericType,
  config: TabAnimationProps = {}
): TabAnimationHookReturn<GenericType> {
  const { tension = 80, friction = 8, useNativeDriver = false } = config;

  const [activeTab, setActiveTab] = useState<GenericType>(initialTab);
  const [tabContainerWidths, setTabContainerWidths] = useState<{
    [key in GenericType]?: number;
  }>({});

  // Gunakan Animated.Value untuk smooth animation
  const activeTabOffset = useRef(new Animated.Value(0)).current;
  const activeTabWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let currentOffset = 0;
    let found = false;

    tabs.forEach((tab) => {
      const tabWidth = tabContainerWidths[tab] || 0;

      if (tab === activeTab) {
        // Animasikan perpindahan dengan spring effect
        Animated.parallel([
          Animated.spring(activeTabOffset, {
            toValue: currentOffset,
            useNativeDriver,
            tension,
            friction,
          }),
          Animated.spring(activeTabWidth, {
            toValue: tabWidth,
            useNativeDriver,
            tension,
            friction,
          }),
        ]).start();
        found = true;
      }

      currentOffset += tabWidth;
    });

    if (!found) {
      Animated.parallel([
        Animated.spring(activeTabOffset, {
          toValue: 0,
          useNativeDriver,
          tension,
          friction,
        }),
        Animated.spring(activeTabWidth, {
          toValue: 0,
          useNativeDriver,
          tension,
          friction,
        }),
      ]).start();
    }
  }, [
    activeTab,
    tabContainerWidths,
    tabs,
    tension,
    friction,
    useNativeDriver,
    activeTabOffset,
    activeTabWidth,
  ]);

  const onTabPress = (tab: GenericType) => {
    setActiveTab(tab);
  };

  const onTabLayout = (tab: GenericType, event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTabContainerWidths((prev) => {
      if (prev[tab] === width) return prev;
      return { ...prev, [tab]: width };
    });
  };

  return {
    activeTab,
    activeTabOffset,
    activeTabWidth,
    tabContainerWidths,
    onTabPress,
    onTabLayout,
  };
}
