// components/AnimatedTabBar.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
  Animated,
} from 'react-native';
import { AnimatedTabBarConfig } from '@/interfaces/tabAnimation';

interface AnimatedTabBarProps<T extends string> {
  // Required props
  tabs: readonly T[];
  activeTab: T;
  onTabPress: (tab: T) => void;
  activeTabOffset: Animated.Value;
  activeTabWidth: Animated.Value;
  tabContainerWidths: { [key in T]?: number };
  onTabLayout: (tab: T, event: LayoutChangeEvent) => void;

  // Combined config props
  config?: AnimatedTabBarConfig<T>;
}

export default function AnimatedTabBar<T extends string>({
  // Required props
  tabs,
  activeTab,
  onTabPress,
  activeTabOffset,
  activeTabWidth,
  tabContainerWidths,
  onTabLayout,

  // Customization
  config = {},
}: AnimatedTabBarProps<T>) {
  const {
    // Animation & Style
    indicatorColor = '#1475BA',
    containerClassName = '',

    // Layout
    containerStyle,
    tabContainerStyle,
    tabStyle,
    activeTabStyle,

    // Text
    textStyle,
    activeTextStyle,

    // Behavior
    minTabWidth = 80,
    maxTabWidth = 200,
    enableScroll = true,
    centerTabs = true,

    // Render functions
    renderTab,
    renderIndicator,
  } = config;

  const scrollViewRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Hitung total width semua tab
  const totalTabsWidth = tabs.reduce(
    (sum, tab) => sum + (tabContainerWidths[tab] || 0),
    0
  );

  // Tentukan mode: flex untuk tab sedikit, scroll untuk tab banyak
  const useFlexMode = centerTabs && totalTabsWidth < containerWidth;

  useEffect(() => {
    // Hanya scroll jika dalam scroll mode dan enableScroll true
    if (
      enableScroll &&
      !useFlexMode &&
      scrollViewRef.current &&
      tabContainerWidths[activeTab]
    ) {
      const index = tabs.indexOf(activeTab);
      const offset = tabs
        .slice(0, index)
        .reduce((sum, tab) => sum + (tabContainerWidths[tab] || 0), 0);

      scrollViewRef.current.scrollTo({
        x: offset - 20,
        animated: true,
      });
    }
  }, [activeTab, tabContainerWidths, tabs, useFlexMode, enableScroll]);

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  // Default Indicator Render
  const defaultRenderIndicator = (
    width: Animated.Value,
    offset: Animated.Value
  ) => (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: offset,
          width: width,
          height: '100%',
          backgroundColor: indicatorColor,
          borderRadius: 16,
        },
        containerStyle,
      ]}
    />
  );

  // Default Tab Render
  const defaultRenderTab = (tab: T, isActive: boolean) => (
    <Text
      style={[
        {
          color: isActive ? 'white' : 'black',
          fontWeight: isActive ? 'bold' : 'normal',
          fontSize: 16,
          textAlign: 'center',
        },
        textStyle,
        isActive && activeTextStyle,
      ]}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {tab}
    </Text>
  );

  // 🎯 FLEX MODE - Untuk tab sedikit (2, 3, 4 tab)
  if (useFlexMode && containerWidth > 0) {
    return (
      <View
        style={containerStyle}
        className={`mx-4 my-1 rounded-2xl bg-gray-100 p-2 ${containerClassName}`}
        onLayout={handleContainerLayout}
      >
        <View
          style={[{ overflow: 'hidden', borderRadius: 16 }, tabContainerStyle]}
        >
          {/* Custom atau Default Indicator */}
          {renderIndicator
            ? renderIndicator(activeTabWidth, activeTabOffset)
            : defaultRenderIndicator(activeTabWidth, activeTabOffset)}

          {/* Flex Container - Membagi lebar sama rata */}
          <View style={{ flexDirection: 'row' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => onTabPress(tab)}
                  onLayout={(e) => onTabLayout(tab, e)}
                  style={[
                    {
                      flex: 1,
                      paddingHorizontal: 8,
                      paddingVertical: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: minTabWidth,
                      maxWidth: maxTabWidth,
                    },
                    tabStyle,
                    isActive && activeTabStyle,
                  ]}
                >
                  {renderTab
                    ? renderTab(tab, isActive)
                    : defaultRenderTab(tab, isActive)}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  // 🎯 SCROLL MODE - Untuk tab banyak (5+ tab) atau centerTabs=false
  return (
    <View
      style={containerStyle}
      className={`mx-4 my-1 rounded-2xl bg-gray-100 p-2 ${containerClassName}`}
      onLayout={handleContainerLayout}
    >
      <View
        style={[{ overflow: 'hidden', borderRadius: 16 }, tabContainerStyle]}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={enableScroll}
          contentContainerStyle={
            centerTabs && totalTabsWidth < containerWidth
              ? { flexGrow: 1, justifyContent: 'center' }
              : { flexGrow: 1 }
          }
        >
          {/* Custom atau Default Indicator */}
          {renderIndicator
            ? renderIndicator(activeTabWidth, activeTabOffset)
            : defaultRenderIndicator(activeTabWidth, activeTabOffset)}

          {/* Tab Buttons */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => onTabPress(tab)}
                onLayout={(e) => onTabLayout(tab, e)}
                style={[
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: minTabWidth,
                    maxWidth: maxTabWidth,
                  },
                  tabStyle,
                  isActive && activeTabStyle,
                ]}
              >
                {renderTab
                  ? renderTab(tab, isActive)
                  : defaultRenderTab(tab, isActive)}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
