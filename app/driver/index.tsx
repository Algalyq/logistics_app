import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { TabHeader } from '@/components/tabs/TabHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HeaderLanguageSwitcher } from '@/components/HeaderLanguageSwitcher';
import profileService, { ProfileData } from '@/api/profileService';
import { useTranslation } from '@/translations/useTranslation';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
interface DashboardStats {
  activeOrders: number;
  completedOrders: number;
  totalEarnings: number;
  rating: number;
}

export default function DriverDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileData = await profileService.getProfile();
        setProfile(profileData);
        
        // Fetch dashboard stats
        // This would be the actual endpoint for analytics
        // const analyticsResponse = await apiClient.get('/api/analytics/');
        // setStats(analyticsResponse.data);
        
        // For now, create stats based on profile data
        if (profileData) {
          setStats({
            activeOrders: profileData.total_orders ? profileData.total_orders - (profileData.completed_orders || 0) - (profileData.cancelled_orders || 0) : 0,
            completedOrders: profileData.completed_orders || 0,
            totalEarnings: 0, // Not available in profile data
            rating: profileData.rating || 0
          });
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={styles.loadingText}>{t('loading')}</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.containerWrapper}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerText}>{t('driverDashboard')}</ThemedText>
          <HeaderLanguageSwitcher />
        </View>
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{stats?.activeOrders || 0}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('activeOrders')}</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{stats?.completedOrders || 0}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('completed')}</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{stats?.rating ? `${stats.rating}/5` : 'N/A'}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('rating')}</ThemedText>
          </View>
        </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => router.push('/driver/my-orders')}
        >
          <ThemedText style={[styles.actionButtonText, { color: Colors.light.primary }]}>{t('myOrders')}</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{t('quickAccess')}</ThemedText>
        <View style={styles.quickLinks}>
          <TouchableOpacity 
            style={styles.linkCard}
            onPress={() => router.push('/driver/documents')}
          >
            <ThemedText style={styles.linkText}>{t('myDocuments')}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkCard}
            onPress={() => router.push('/driver/profile')}
          >
            <ThemedText style={styles.linkText}>{t('myProfile')}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 24,
    color: '#282828',
    marginBottom: 8,
  },
  subHeader: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 24,
    color: '#35B468',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#35B468',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#35B468',
  },
  actionButtonText: {
    fontFamily: 'Comfortaa-SemiBold',
    color: '#fff',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 18,
    color: '#282828',
    marginBottom: 16,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  linkText: {
    fontFamily: 'Comfortaa-Medium',
    color: '#35B468',
    fontSize: 14,
  },
});
