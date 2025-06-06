import { Tabs, Redirect } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import React, { useEffect } from 'react';

import { useTranslation } from '@/translations/useTranslation';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
// Using light theme only
import { HapticTab } from '@/components/HapticTab';
import apiClient from '@/api/client';

export default function TabLayout() {
  const { t } = useTranslation();
  const userRole = apiClient.getUserRole();
  
  // Redirect to login if not authenticated
  if (!apiClient.isAuthenticated()) {
    return <Redirect href="/auth/login" />;
  }
  
  // Redirect drivers to driver layout
  if (userRole === 'driver') {
    return <Redirect href="/driver" />;
  }
  
  // Log access for debugging
  useEffect(() => {
    console.log('Customer tabs layout accessed by role:', userRole);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary, // Always use light theme primary color
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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: t('analysis'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="enhanced-orders"
        options={{
          title: t('orders'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="shippingbox.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
