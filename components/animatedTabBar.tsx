import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
  Animated,
} from 'react-native';

// OUR INTERFACES
import { AnimatedTabBarConfig } from '@/interfaces/animatedTabBarProps';

interface AnimatedTabBarProps<T extends string> {
  tabs: readonly T[];
  activeTab: T;
  onTabPress: (tab: T) => void;
  activeTabOffset: Animated.Value;
  activeTabWidth: Animated.Value;
  tabContainerWidths: { [key in T]?: number };
  onTabLayout: (tab: T, event: LayoutChangeEvent) => void;
  tabBarStyleConfig?: AnimatedTabBarConfig<T>;
}

export default function AnimatedTabBar<T extends string>({
  tabs,
  activeTab,
  onTabPress,
  activeTabOffset,
  activeTabWidth,
  tabContainerWidths,
  onTabLayout,
  tabBarStyleConfig = {},
}: AnimatedTabBarProps<T>) {
  const {
    indicatorColor = '#1475BA',
    containerClassName = '',
    containerStyle,
    tabContainerStyle,
    tabStyle,
    activeTabStyle,
    textStyle,
    activeTextStyle,
    minTabWidth = 80,
    maxTabWidth = 200,
    enableScroll = true,
    centerTabs = true,
    renderTab,
    renderIndicator,
  } = tabBarStyleConfig;

  const scrollViewRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const totalTabsWidth = tabs.reduce(
    (sum, tab) => sum + (tabContainerWidths[tab] || 0),
    0
  );

  const useFlexMode = centerTabs && totalTabsWidth < containerWidth;

  useEffect(() => {
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

  if (useFlexMode && containerWidth > 0) {
    return (
      <View
        style={containerStyle}
        className={`mx-4 my-1 rounded-2xl bg-gray-100 ${containerClassName}`}
        onLayout={handleContainerLayout}
      >
        <View
          style={[{ overflow: 'hidden', borderRadius: 16 }, tabContainerStyle]}
        >
          {renderIndicator
            ? renderIndicator(activeTabWidth, activeTabOffset)
            : defaultRenderIndicator(activeTabWidth, activeTabOffset)}

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

  return (
    <View
      style={containerStyle}
      className={`mx-4 my-1 rounded-2xl bg-gray-100 ${containerClassName}`}
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
          {renderIndicator
            ? renderIndicator(activeTabWidth, activeTabOffset)
            : defaultRenderIndicator(activeTabWidth, activeTabOffset)}

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
