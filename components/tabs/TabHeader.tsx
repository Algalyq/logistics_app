import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { Colors } from '@/constants/Colors';
import apiClient from '@/api/client';

interface TabHeaderProps {
  title?: string;
  showProfile?: boolean;
}

export function TabHeader({ 
  title, 
  showProfile = false
}: TabHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  
  // Get user data from API client
  useEffect(() => {
    const userData = apiClient.getUserData();
    if (userData) {
      // Format user's full name using first_name and last_name from userData
      const fullName = `${userData.first_name} ${userData.last_name}`;
      setUserName(fullName);
    }
  }, []);

  const navigateToProfile = () => {
    // Redirect to the correct profile page based on user role
    const userRole = apiClient.getUserRole();
    if (userRole === 'driver') {
      router.push('/driver/profile');
    } else {
      router.push('/profile');
    }
  };

  // Always use light theme colors regardless of system setting
  const headerStyle = {
    ...tabStyles.header,
    backgroundColor: Colors.light.primary, // Always use green primary color
  };
  
  return (
    <View style={headerStyle}>
      {showProfile ? (
        <View style={tabStyles.headerContent}>
          <View>
            <ThemedText style={tabStyles.welcome}>{t('welcomeBack')}</ThemedText>
            <ThemedText style={tabStyles.userName}>{userName || t('guest')}</ThemedText>
          </View>
          <TouchableOpacity 
            style={tabStyles.profileImageContainer}
            onPress={navigateToProfile}
          >
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={tabStyles.profileImage}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <ThemedText style={tabStyles.headerTitle}>{title}</ThemedText>
      )}
    </View>
  );
}
