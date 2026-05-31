import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import {Calendar, ChartLine, House, User} from 'lucide-react-native';
import FabTabButton from '@/components/ui/fab-tab-button';
import { useAuth } from '@/src/context/auth-context';

export default function TabLayout() {
 const insets = useSafeAreaInsets();
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.common.tint,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom,
          overflow: 'visible'
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} strokeWidth={1.25}/>,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} strokeWidth={1.25}/>,
        }}
      />
      <Tabs.Screen
        name="addHabit"
        options={{
          tabBarButton: (props) => <FabTabButton {...props}/>
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, size }) => <ChartLine size={size} color={color} strokeWidth={1.25}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={28} color={color} strokeWidth={1.25}/>,
        }}
      />
    </Tabs>
  );
}
