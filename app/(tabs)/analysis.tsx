import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { TabHeader } from '@/components/tabs/TabHeader';
import { Card } from '@/components/tabs/Card';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import apiClient from '@/api/client';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Enhanced analytics data
const analysisData = {
  summary: {
    todaysOrders: 8,
    weeklyOrders: 35,
    monthlyOrders: 124,
    totalOrders: 1254,
  },
  financials: {
    todayRevenue: 1245,
    weeklyRevenue: 5680,
    monthlyRevenue: 19450,
    averageOrderValue: 157,
    growth: 14.5, // percentage
  },
  performance: {
    onTimeDelivery: 97, // percentage
    cancelRate: 2.3, // percentage
    returnRate: 1.5, // percentage
    customerSatisfaction: 4.8, // out of 5
  },
  topVehicleTypes: [
    { type: 'Truck', count: 78, icon: 'truck' },
    { type: 'Van', count: 32, icon: 'shuttle-van' },
    { type: 'Refrigerated', count: 14, icon: 'temperature-low' },
  ],
  topProducts: [
    { name: 'Electronics', count: 42, color: '#4285F4' },
    { name: 'Furniture', count: 28, color: '#34A853' },
    { name: 'Food', count: 21, color: '#FBBC05' },
    { name: 'Clothing', count: 18, color: '#EA4335' },
  ],
  monthlyOrdersData: [
    { month: 'Jan', orders: 82 },
    { month: 'Feb', orders: 90 },
    { month: 'Mar', orders: 105 },
    { month: 'Apr', orders: 95 },
    { month: 'May', orders: 110 },
    { month: 'Jun', orders: 124 },
  ]
};

// Tab selector component for time periods
const TimeRangeTab = ({ title, active, onPress }: { title: string, active: boolean, onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.timeRangeTab, active && styles.activeTimeRangeTab]}
    onPress={onPress}
  >
    <ThemedText style={[styles.timeRangeText, active && styles.activeTimeRangeText]}>{title}</ThemedText>
  </TouchableOpacity>
);

// Stat item component
const StatItem = ({ icon, title, value, subValue, trend = 0 }: { icon: string, title: string, value: string | number, subValue?: string, trend?: number }) => (
  <View style={styles.statItem}>
    <View style={styles.statIconContainer}>
      <MaterialIcons name={icon as any} size={24} color="#35B468" />
    </View>
    <View style={styles.statContent}>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      <View style={styles.statValueRow}>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        {trend !== 0 && (
          <View style={[styles.trendContainer, trend > 0 ? styles.positiveTrend : styles.negativeTrend]}>
            <MaterialIcons name={trend > 0 ? 'trending-up' : 'trending-down'} size={16} color={trend > 0 ? '#34A853' : '#EA4335'} />
            <ThemedText style={[styles.trendValue, trend > 0 ? styles.positiveTrendText : styles.negativeTrendText]}>
              {Math.abs(trend)}%
            </ThemedText>
          </View>
        )}
      </View>
      {subValue && <ThemedText style={styles.statSubValue}>{subValue}</ThemedText>}
    </View>
  </View>
);

// Progress bar for visualization
const ProgressBar = ({ progress, color }: { progress: number, color: string }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
  </View>
);

// Main Analysis Screen component
export default function AnalysisScreen() {
  const { t } = useTranslation();
  const userRole = apiClient.getUserRole();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  // Helper to calculate total for vehicle types or products
  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.count, 0);
  };
  
  // Get appropriate financial data based on selected time range
  const getFinancialData = () => {
    switch(timeRange) {
      case 'day':
        return {
          revenue: analysisData.financials.todayRevenue,
          orders: analysisData.summary.todaysOrders,
        };
      case 'week':
        return {
          revenue: analysisData.financials.weeklyRevenue,
          orders: analysisData.summary.weeklyOrders,
        };
      case 'month':
        return {
          revenue: analysisData.financials.monthlyRevenue,
          orders: analysisData.summary.monthlyOrders,
        };
      default:
        return {
          revenue: analysisData.financials.todayRevenue,
          orders: analysisData.summary.todaysOrders,
        };
    }
  };
  
  const financialData = getFinancialData();
  const totalVehicles = calculateTotal(analysisData.topVehicleTypes);
  const totalProducts = calculateTotal(analysisData.topProducts);
  
  return (
    <ThemedView style={tabStyles.container}>
      <TabHeader title={t('logisticsAnalytics')} showProfile />
      
      <ScrollView style={tabStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Time range selector */}
        <View style={styles.timeRangeContainer}>
          <TimeRangeTab 
            title={t('today')} 
            active={timeRange === 'day'} 
            onPress={() => setTimeRange('day')} 
          />
          <TimeRangeTab 
            title={t('thisWeek')} 
            active={timeRange === 'week'} 
            onPress={() => setTimeRange('week')} 
          />
          <TimeRangeTab 
            title={t('thisMonth')} 
            active={timeRange === 'month'} 
            onPress={() => setTimeRange('month')} 
          />
        </View>
        
        {/* Revenue Card */}
        <Card title={t('revenue')}>
          <View style={[styles.revenueContent, styles.revenueCard]}>
            <ThemedText style={styles.currencySymbol}>$</ThemedText>
            <ThemedText style={styles.revenueAmount}>{financialData.revenue.toLocaleString()}</ThemedText>
          </View>
          <View style={styles.revenueTrend}>
            <MaterialIcons name="trending-up" size={20} color="#34A853" />
            <ThemedText style={styles.revenueTrendText}>{analysisData.financials.growth}%</ThemedText>
          </View>
        </Card>
        
        {/* Key Stats */}
        <View style={styles.statsContainer}>
          <StatItem 
            icon="shopping-bag" 
            title={t('analyticsOrders')} 
            value={financialData.orders}
            trend={5.2}
          />
          
          <StatItem 
            icon="attach-money" 
            title={t('averageOrderValue')} 
            value={`$${analysisData.financials.averageOrderValue}`}
            trend={2.3}
          />
        </View>
        
        <View style={styles.statsContainer}>
          <StatItem 
            icon="timer" 
            title={t('onTimeDelivery')} 
            value={`${analysisData.performance.onTimeDelivery}%`}
            trend={1.5}
          />
          
          <StatItem 
            icon="cancel" 
            title={t('cancelRate')} 
            value={`${analysisData.performance.cancelRate}%`}
            trend={-0.8}
          />
        </View>

        {/* Vehicle Types Analysis */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>{t('topVehicleTypes')}</ThemedText>
          </View>
          
          <Card>
            {analysisData.topVehicleTypes.map((vehicle, index) => (
              <View key={`vehicle-${index}`} style={styles.itemRow}>
                <View style={styles.itemIconContainer}>
                  <FontAwesome5 name={vehicle.icon} size={16} color="#35B468" />
                </View>
                <ThemedText style={styles.itemName}>{vehicle.type}</ThemedText>
                <View style={styles.progressContainer}>
                  <ProgressBar 
                    progress={(vehicle.count / totalVehicles) * 100} 
                    color={index === 0 ? '#4285F4' : index === 1 ? '#34A853' : '#FBBC05'} 
                  />
                </View>
                <ThemedText style={styles.itemCount}>{vehicle.count}</ThemedText>
              </View>
            ))}
          </Card>
        </View>
        
        {/* Top Products Analysis */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>{t('topProducts')}</ThemedText>
          </View>
          
          <Card>
            {analysisData.topProducts.map((product, index) => (
              <View key={`product-${index}`} style={styles.itemRow}>
                <View style={[styles.colorDot, { backgroundColor: product.color }]} />
                <ThemedText style={styles.itemName}>{product.name}</ThemedText>
                <View style={styles.progressContainer}>
                  <ProgressBar 
                    progress={(product.count / totalProducts) * 100} 
                    color={product.color} 
                  />
                </View>
                <ThemedText style={styles.itemCount}>{product.count}</ThemedText>
              </View>
            ))}
          </Card>
        </View>
        
        {/* Monthly Trends Graph */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>{t('monthlyTrends')}</ThemedText>
          </View>
          
          <Card>
            <View style={[styles.graphContainer, styles.graphCard]}>
              {/* Graph bars */}
              <View style={styles.graphBars}>
                {analysisData.monthlyOrdersData.map((item, index) => {
                  // Calculate bar height as percentage of maximum value
                  const maxOrders = Math.max(...analysisData.monthlyOrdersData.map(d => d.orders));
                  const barHeightPercentage = (item.orders / maxOrders) * 100;
                  
                  return (
                    <View key={`bar-${index}`} style={styles.barContainer}>
                      <View style={styles.barLabelContainer}>
                        <ThemedText style={styles.barValue}>{item.orders}</ThemedText>
                      </View>
                      <View style={[styles.bar, { height: `${barHeightPercentage}%` }]} />
                      <ThemedText style={styles.barLabel}>{item.month}</ThemedText>
                    </View>
                  );
                })}
              </View>
            </View>
          </Card>
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
  },
  progressContainer: {
    flex: 2,
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'right',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  placeholderText: {
    color: '#888',
  },
  currency: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 4,
  },
  profitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profitAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  
  // New styles for the redesigned components
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  timeRangeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F5F5F5',
  },
  activeTimeRangeTab: {
    backgroundColor: '#35B468',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#666666',
  },
  activeTimeRangeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  revenueCard: {
    marginBottom: 16,
  },
  revenueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#35B468',
    marginRight: 4,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  revenueTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revenueTrendText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34A853',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(53, 180, 104, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  positiveTrend: {
    backgroundColor: 'rgba(52, 168, 83, 0.1)',
  },
  negativeTrend: {
    backgroundColor: 'rgba(234, 67, 53, 0.1)',
  },
  trendValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  positiveTrendText: {
    color: '#34A853',
  },
  negativeTrendText: {
    color: '#EA4335',
  },
  statSubValue: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  progressBarContainer: {
    flex: 2,
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transparentCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    padding: 0,
  },
  itemIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(53, 180, 104, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  graphCard: {
    padding: 16,
  },
  graphContainer: {
    height: 200,
    marginTop: 8,
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  barLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    width: 16,
    backgroundColor: '#35B468',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
});
