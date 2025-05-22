import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HeaderLanguageSwitcher } from '@/components/HeaderLanguageSwitcher';
import { tabStyles } from '@/assets/styles/tabStyles';
import { COLORS } from '@/assets/styles/authStyles';
import { useTranslation } from '@/translations/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';
import profileService, { ProfileData } from '@/api/profileService';
import { Colors } from '@/constants/Colors';
import authService from '@/api/authService';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const goBack = () => {
    router.back();
  };
  
  // Logout handler
  const handleLogout = async () => {
    try {
      // Show loading indicator or disable the button here if needed
      const success = await authService.logout();
      if (success) {
        // Navigate to login screen
        router.replace('/auth/login');
      } else {
        // Handle logout failure
        console.error('Logout failed');
        // Could show an alert or notification here
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle the error, perhaps show a message to the user
    }
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileService.getProfile();
        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    );
  }

  if (error || !profile) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.errorText}>{error || 'Profile not found'}</ThemedText>
        <TouchableOpacity 
          style={tabStyles.actionButton}
          onPress={() => setLoading(true)}
        >
          <ThemedText style={tabStyles.actionButtonText}>Refresh</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  const fullName = `${profile.first_name} ${profile.last_name}`;
  const userRole = profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1) || 'User';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('profile')}</ThemedText>
          <HeaderLanguageSwitcher />
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
          <ThemedText style={styles.userName}>{fullName}</ThemedText>
          <ThemedText style={styles.userRole}>{userRole}</ThemedText>
        </View>
        
        {/* User Information */}
        <View style={tabStyles.card}>
          <ThemedText style={tabStyles.cardTitle}>{t('personalInfo')}</ThemedText>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>{t('email')}:</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.email}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>{t('phone')}:</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.phone || 'No phone number'}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>{t('company')}:</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.company_name || profile.vehicle_type || 'Not specified'}</ThemedText>
          </View>

          
          {/* Driver-specific information */}
          {profile.role === 'driver' && (
            <>
              {profile.experience_years !== undefined && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Experience:</ThemedText>
                  <ThemedText style={styles.infoValue}>{profile.experience_years} years</ThemedText>
                </View>
              )}
              
              {profile.total_kilometers !== undefined && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Total Distance:</ThemedText>
                  <ThemedText style={styles.infoValue}>{profile.total_kilometers} km</ThemedText>
                </View>
              )}
              
              {profile.assigned_truck && (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Assigned Truck:</ThemedText>
                  <ThemedText style={styles.infoValue}>{JSON.stringify(profile.assigned_truck)}</ThemedText>
                </View>
              )}
            </>
          )}
        </View>
        
        {/* Other Settings */}
        <View style={tabStyles.card}>
          <ThemedText style={tabStyles.cardTitle}>{t('settings')}</ThemedText>
          
          <TouchableOpacity style={styles.settingRow}>
            <ThemedText>{t('notifications')}</ThemedText>
            <MaterialIcons name="notifications" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <ThemedText>{t('security')}</ThemedText>
            <MaterialIcons name="lock" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <ThemedText>{t('help')}</ThemedText>
            <MaterialIcons name="help" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutText}>{t('logout')}</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FBFBFB',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Comfortaa-Medium',
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.PRIMARY, // This will be replaced dynamically by the theme system
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
