import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { TabHeader } from '@/components/tabs/TabHeader';
import { Card } from '@/components/tabs/Card';

// Dummy data for the analysis screen
const analysisData = {
  todaysOrders: 8,
  weeklyOrders: 35,
  monthlyOrders: 124,
  averageOrderValue: 157,
  topVehicleTypes: [
    { type: 'Truck', count: 78 },
    { type: 'Van', count: 32 },
    { type: 'Refrigerated', count: 14 },
  ],
  topProducts: [
    { name: 'Electronics', count: 42 },
    { name: 'Furniture', count: 28 },
    { name: 'Food', count: 21 },
  ],
};

export default function AnalysisScreen() {
  const { t } = useTranslation();
  return (
    <ThemedView style={tabStyles.container}>
      <TabHeader title={t('logisticsAnalytics')} />
      
      <ScrollView style={tabStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Statistics */}
        <ThemedView style={tabStyles.section}>
          <ThemedText style={tabStyles.sectionTitle}>{t('orderStatistics')}</ThemedText>
          
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statCard}>
              <ThemedText style={styles.statValue}>{analysisData.todaysOrders}</ThemedText>
              <ThemedText style={styles.statLabel}>{t('today')}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statCard}>
              <ThemedText style={styles.statValue}>{analysisData.weeklyOrders}</ThemedText>
              <ThemedText style={styles.statLabel}>{t('thisWeek')}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statCard}>
              <ThemedText style={styles.statValue}>{analysisData.monthlyOrders}</ThemedText>
              <ThemedText style={styles.statLabel}>{t('thisMonth')}</ThemedText>
            </TouchableOpacity>
          </View>
          
          <Card title={t('averageOrderValue')}>
            <ThemedView style={styles.profitContainer}>
              <ThemedText style={styles.currency}>$</ThemedText>
              <ThemedText style={styles.profitAmount}>{analysisData.averageOrderValue}</ThemedText>
             </ThemedView>
          </Card>
        </ThemedView>
        
        {/* Vehicle Types Analysis */}
        <ThemedView style={tabStyles.section}>
          <ThemedText style={tabStyles.sectionTitle}>{t('topVehicleTypes')}</ThemedText>
          
          <Card>
            {analysisData.topVehicleTypes.map((vehicle, index) => (
              <View key={`vehicle-${index}`} style={styles.itemRow}>
                <ThemedText style={styles.itemName}>{vehicle.type}</ThemedText>
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${(vehicle.count / analysisData.monthlyOrders) * 100}%`,
                        backgroundColor: index === 0 ? tabStyles.actionButton.backgroundColor : index === 1 ? '#4ECDC4' : '#FF6B6B' 
                      }
                    ]} 
                  />
                </View>
                <ThemedText style={styles.itemCount}>{vehicle.count}</ThemedText>
              </View>
            ))}
          </Card>
        </ThemedView>
        
        {/* Top Products Analysis */}
        <ThemedView style={tabStyles.section}>
          <ThemedText style={tabStyles.sectionTitle}>{t('topProducts')}</ThemedText>
          
          <Card>
            {analysisData.topProducts.map((product, index) => (
              <View key={`product-${index}`} style={styles.itemRow}>
                <ThemedText style={styles.itemName}>{product.name}</ThemedText>
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${(product.count / analysisData.monthlyOrders) * 100}%`,
                        backgroundColor: index === 0 ? tabStyles.actionButton.backgroundColor : index === 1 ? '#4ECDC4' : '#FF6B6B'  
                      }
                    ]} 
                  />
                </View>
                <ThemedText style={styles.itemCount}>{product.count}</ThemedText>
              </View>
            ))}
          </Card>
        </ThemedView>
        
        {/* Placeholder for charts - would typically use a charting library */}
        <ThemedView style={tabStyles.section}>
          <ThemedText style={tabStyles.sectionTitle}>{t('orderTrends')}</ThemedText>
          <View style={styles.chartPlaceholder}>
            <ThemedText style={styles.placeholderText}>Chart will be implemented here</ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: tabStyles.actionButton.backgroundColor,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#777777',
  },

  averageValue: {
    fontSize: 24,
    fontWeight: '700',
    color: tabStyles.actionButton.backgroundColor,
    textAlign: 'center',
    marginTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    color: '#282828',
    width: 100,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
    width: 30,
    textAlign: 'right',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  placeholderText: {
    color: '#777777',
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
  }
});
