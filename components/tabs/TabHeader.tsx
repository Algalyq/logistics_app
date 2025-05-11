import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';

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

  return (
    <View style={tabStyles.header}>
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
