import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSwitcher } from '@/components/auth/LanguageSwitcher';
import { tabStyles } from '@/assets/styles/tabStyles';
import { COLORS } from '@/assets/styles/authStyles';
import { useTranslation } from '@/translations/useTranslation';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const goBack = () => {
    router.back();
  };
  
  // Mock user data
  const userData = {
    fullName: 'Nurzhan Akhmetov',
    email: 'nurzhan.akhmetov@example.com',
    phone: '+7 (707) 123-4567',
    company: 'Trackit Logistics',
    role: 'Logistics Manager'
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Image 
              source={require('@/assets/images/icon.png')} // Replace with back icon
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('profile')}</ThemedText>
          <View style={styles.placeholder} />
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageLarge}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.profileImage}
            />
          </View>
          <ThemedText style={styles.userName}>{userData.fullName}</ThemedText>
          <ThemedText style={styles.userRole}>{userData.role}</ThemedText>
        </View>
        
        {/* User Information */}
        <View style={tabStyles.card}>
          <ThemedText style={tabStyles.cardTitle}>{t('personalInfo')}</ThemedText>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>{t('email')}:</ThemedText>
            <ThemedText style={styles.infoValue}>{userData.email}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>{t('phone')}:</ThemedText>
            <ThemedText style={styles.infoValue}>{userData.phone}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>{t('company')}:</ThemedText>
            <ThemedText style={styles.infoValue}>{userData.company}</ThemedText>
          </View>
        </View>
        
        {/* Language Settings */}
        <View style={tabStyles.card}>
          <ThemedText style={tabStyles.cardTitle}>{t('language')}</ThemedText>
          <View style={styles.languageContainer}>
            <ThemedText style={styles.languageLabel}>{t('selectLanguage')}:</ThemedText>
            <LanguageSwitcher />
          </View>
        </View>
        
        {/* Other Settings */}
        <View style={tabStyles.card}>
          <ThemedText style={tabStyles.cardTitle}>{t('settings')}</ThemedText>
          
          <TouchableOpacity style={styles.settingRow}>
            <ThemedText>{t('notifications')}</ThemedText>
            <Image 
              source={require('@/assets/images/icon.png')} // Replace with arrow icon
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <ThemedText>{t('security')}</ThemedText>
            <Image 
              source={require('@/assets/images/icon.png')} // Replace with arrow icon
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <ThemedText>{t('help')}</ThemedText>
            <Image 
              source={require('@/assets/images/icon.png')} // Replace with arrow icon
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <ThemedText style={styles.logoutText}>{t('logout')}</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.PRIMARY,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Comfortaa',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  profileImageLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Comfortaa',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#777777',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#282828',
  },
  languageContainer: {
    paddingVertical: 12,
  },
  languageLabel: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: '#777777',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 15,
    marginVertical: 24,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
