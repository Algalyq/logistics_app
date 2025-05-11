import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { TabHeader } from '@/components/tabs/TabHeader';
import { Card } from '@/components/tabs/Card';
import { SectionHeader } from '@/components/tabs/SectionHeader';

// Dummy data for the dashboard
const dashboardData = {
  totalOrders: 124,
  completedOrders: 98,
  pendingOrders: 26,
  totalProfit: 15420,
  weeklyProfit: 4250,
  monthlyProfit: 15420,
};



export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Calculate completion percentage
  const completionPercentage = Math.round(
    (dashboardData.completedOrders / dashboardData.totalOrders) * 100
  );
  
  // Get profit based on selected period
  const getProfitByPeriod = () => {
    switch (selectedPeriod) {
      case 'week':
        return dashboardData.weeklyProfit;
      case 'month':
        return dashboardData.monthlyProfit;
      default:
        return dashboardData.totalProfit;
    }
  };
  
  const navigateToAnalysis = () => {
    router.push('/analysis');
  };
  
  const navigateToOrders = () => {
    router.push('/orders');
  };

  return (
    <ThemedView style={tabStyles.container}>
      {/* Header with profile */}
      <TabHeader showProfile={true} />
      
      <ScrollView style={tabStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Dashboard Summary */}
        <ThemedView style={tabStyles.section}>
          <ThemedText style={tabStyles.sectionTitle}>{t('dashboard')}</ThemedText>
          
          {/* Order Completion Card */}
          <Card 
            title={t('orderCompletionRate')}
            onPress={navigateToAnalysis}
          >

            <View style={styles.completionContainer}>
              <View style={styles.percentageCircle}>
                <ThemedText style={styles.percentageText}>{completionPercentage}%</ThemedText>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>{t('totalOrders')}</ThemedText>
                  <ThemedText style={styles.statValue}>{dashboardData.totalOrders}</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>{t('completed')}</ThemedText>
                  <ThemedText style={styles.statValue}>{dashboardData.completedOrders}</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>{t('pending')}</ThemedText>
                  <ThemedText style={styles.statValue}>{dashboardData.pendingOrders}</ThemedText>
                </View>
              </View>
            </View>
          </Card>
          
          {/* Profit Card */}
          <Card
            title={t('profitOverview')}
            onPress={navigateToAnalysis}
            headerRight={
              <ThemedView style={styles.periodSelector}>
                <TouchableOpacity 
                  style={[styles.periodButton, selectedPeriod === 'week' && styles.activePeriod]}
                  onPress={() => setSelectedPeriod('week')}
                >
                  <ThemedText style={[styles.periodText, selectedPeriod === 'week' && styles.activePeriodText]}>{t('week')}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.periodButton, selectedPeriod === 'month' && styles.activePeriod]}
                  onPress={() => setSelectedPeriod('month')}
                >
                  <ThemedText style={[styles.periodText, selectedPeriod === 'month' && styles.activePeriodText]}>{t('month')}</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            }
          >
            <ThemedView style={styles.profitContainer}>
              <ThemedText style={styles.currency}>$</ThemedText>
              <ThemedText style={styles.profitAmount}>{getProfitByPeriod().toLocaleString()}</ThemedText>
            </ThemedView>
          </Card>
        </ThemedView>
        
        {/* Recent Orders Section */}
        <ThemedView style={tabStyles.section}>
          <SectionHeader 
            title={t('recentOrders')} 
            actionText={t('viewAll')} 
            onActionPress={navigateToOrders} 
          />
          
          {/* You can add the list of recent orders here */}
          <ThemedText style={tabStyles.emptyText}>{t('noRecentOrders')}</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  completionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  percentageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tabStyles.actionButton.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FBFBFB',
  },
  statsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statItem: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  periodButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F5F7FA',
  },
  activePeriod: {
    backgroundColor: tabStyles.actionButton.backgroundColor,
  },
  periodText: {
    fontSize: 12,
    color: '#777777',
  },
  activePeriodText: {
    color: '#FBFBFB',
    fontWeight: '600',
  },
  profitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: tabStyles.actionButton.backgroundColor,
    marginRight: 4,
  },
  profitAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#282828',
  },
});
