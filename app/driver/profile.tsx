import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HeaderLanguageSwitcher } from '@/components/HeaderLanguageSwitcher';
import profileService, { ProfileData } from '@/api/profileService';
import { useTranslation } from '@/translations/useTranslation';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { tabStyles } from '@/assets/styles/tabStyles';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { LanguageSwitcher } from '@/components/auth/LanguageSwitcher';

export default function DriverProfileScreen() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getProfileDriver();
      console.log(profileData);
      setProfile(profileData);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Navigate to login screen
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={styles.loadingText}>{t('loading')}</ThemedText>
      </ThemedView>
    );
  }

  if (error || !profile) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>{error || 'Profile not found'}</ThemedText>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchProfile}>
          <ThemedText style={styles.refreshButtonText}>{t('continue')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <ThemedText style={styles.placeholderText}>
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </ThemedText>
              </View>
            )}
          </View>

          
          <ThemedText style={styles.name}>
            {profile.first_name} {profile.last_name}
          </ThemedText>
          
          <ThemedText style={styles.role}>
            {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
          </ThemedText>

          {profile.rating !== undefined && (
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={16} color="#FFD700" />
              <ThemedText style={styles.rating}>
                {profile.rating.toFixed(1)}/5
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{profile.total_orders || 0}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('totalOrders')}</ThemedText>
          </View>
          
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{profile.completed_orders || 0}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('completed')}</ThemedText>
          </View>
          
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{profile.cancelled_orders || 0}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('cancelled')}</ThemedText>
          </View>
        </View>

        <View style={styles.infoSection}>
          <ThemedText style={styles.sectionTitle}>{t('personalInfo')}</ThemedText>
          
          <View style={styles.infoItem}>
            <IconSymbol name="envelope.fill" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.infoText}>{profile.email}</ThemedText>
          </View>
          
          {profile.phone && (
            <View style={styles.infoItem}>
              <IconSymbol name="phone.fill" size={20} color={Colors.light.primary} />
              <ThemedText style={styles.infoText}>{profile.phone}</ThemedText>
            </View>
          )}

          {profile.address && (
            <View style={styles.infoItem}>
              <IconSymbol name="location.fill" size={20} color={Colors.light.primary} />
              <ThemedText style={styles.infoText}>{profile.address}</ThemedText>
            </View>
          )}
          
          {profile.vehicle_type && (
            <View style={styles.infoItem}>
              <IconSymbol name="car.fill" size={20} color={Colors.light.primary} />
              <ThemedText style={styles.infoText}>{profile.vehicle_type}</ThemedText>
            </View>
          )}
          
          {profile.license_number && (
            <View style={styles.infoItem}>
              <IconSymbol name="creditcard.fill" size={20} color={Colors.light.primary} />
              <ThemedText style={styles.infoText}>{profile.license_number}</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>

        <LanguageSwitcher />

          <TouchableOpacity 
            style={styles.actionButton}
            // Using just the component name instead of a full path
            onPress={() => console.log('Edit profile - not yet implemented')}
          >
            <ThemedText style={styles.actionButtonText}>{t('save')}</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <ThemedText style={[styles.actionButtonText, styles.logoutText]}>{t('logout')}</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#FFFFFF',
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 18,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 14,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    marginBottom: 16,
    borderRadius: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontFamily: 'Comfortaa',
    fontSize: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 24,
    color: '#282828',
    marginBottom: 4,
  },
  role: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
    color: '#777777',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rating: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 14,
    color: '#282828',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Comfortaa-Bold',
    fontSize: 20,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 12,
    color: '#777777',
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 18,
    color: '#282828',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
    color: '#282828',
    marginLeft: 12,
    flex: 1,
  },
  actionsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
  },
});
