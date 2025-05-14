import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { Colors } from '@/constants/Colors';

interface TabHeaderProps {
  title?: string;
  showProfile?: boolean;
  userName?: string;
}

export function TabHeader({ 
  title, 
  showProfile = false, 
  userName = 'Nurzhan Akhmetov' 
}: TabHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const navigateToProfile = () => {
    router.push('/profile');
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
            <ThemedText style={tabStyles.userName}>{userName}</ThemedText>
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
