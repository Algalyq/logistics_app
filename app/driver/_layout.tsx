import { Tabs, Redirect } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import React, { useEffect } from 'react';

import { useTranslation } from '@/translations/useTranslation';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { HapticTab } from '@/components/HapticTab';
import apiClient from '@/api/client';
import { HeaderLanguageSwitcher } from '@/components/HeaderLanguageSwitcher';

export default function DriverTabLayout() {
  const { t } = useTranslation();
  const userRole = apiClient.getUserRole();
  
  // Redirect to login if not authenticated
  if (!apiClient.isAuthenticated()) {
    return <Redirect href="/auth/login" />;
  }
  
  // Redirect non-drivers to customer layout
  if (userRole !== 'driver') {
    return <Redirect href="/customer" />;
  }
  
  // Log access for debugging
  useEffect(() => {
    console.log('Driver tabs layout accessed by role:', userRole);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'Comfortaa-SemiBold',
          color: '#282828',
        },
        headerTintColor: '#35B468',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('driverDashboard'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="my-orders"
        options={{
          title: t('myOrders'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: t('documents'),
          headerTitle: t('myDocuments'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile'),
          headerTitle: t('myProfile'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
