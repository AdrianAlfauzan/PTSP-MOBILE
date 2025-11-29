import React, { ReactNode } from 'react';
import {
  StyleProp,
  TextStyle,
  ViewStyle,
  LayoutChangeEvent,
  Animated,
} from 'react-native';

export interface AnimatedTabBarProps {
  indicatorColor?: string;
  containerClassName?: string;
  tension?: number;
  friction?: number;
  useNativeDriver?: boolean;
}

export interface TabBarCustomizationProps {
  // Layout
  containerStyle?: StyleProp<ViewStyle>;
  tabContainerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  activeTabStyle?: StyleProp<ViewStyle>;

  // Text
  textStyle?: StyleProp<TextStyle>;
  activeTextStyle?: StyleProp<TextStyle>;

  // Behavior
  minTabWidth?: number;
  maxTabWidth?: number;
  enableScroll?: boolean;
  centerTabs?: boolean;
}

export interface TabBarRenderProps<T extends string> {
  renderTab?: (tab: T, isActive: boolean) => ReactNode;
  renderIndicator?: (
    width: Animated.Value,
    offset: Animated.Value
  ) => React.ReactNode;
}

export type TabAnimationHookReturn<T extends string> = {
  activeTab: T;
  activeTabOffset: Animated.Value;
  activeTabWidth: Animated.Value;
  tabContainerWidths: { [key in T]?: number };
  onTabPress: (tab: T) => void;
  onTabLayout: (tab: T, event: LayoutChangeEvent) => void;
};

// Combined config type for AnimatedTabBar
export type AnimatedTabBarConfig<T extends string> = AnimatedTabBarProps &
  TabBarCustomizationProps &
  TabBarRenderProps<T>;
