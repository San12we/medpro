import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HomeImg, TaskImg, InboxImg, ProfileImg } from '../../theme/Images';

const CustomTabIcon = ({ source, focused }) => {
  return (
    <Image
      source={source}
      style={{
        width: 24,
        height: 24,
        tintColor: focused ? '#20bf55' : 'black',
      }}
    />
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#20bf55',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { paddingBottom: 10, height: 60 },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => <CustomTabIcon source={HomeImg} focused={focused} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          tabBarIcon: ({ focused }) => <CustomTabIcon source={TaskImg} focused={focused} />,
          tabBarLabel: 'Task',
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => <CustomTabIcon source={InboxImg} focused={focused} />,
          tabBarLabel: 'Wallet',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <CustomTabIcon source={ProfileImg} focused={focused} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
