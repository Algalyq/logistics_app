import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabHeader } from '@/components/tabs/TabHeader';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function AnalysisScreen() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Sample data for the charts
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };
  
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`, // Green
        strokeWidth: 2
      },
    ],
    legend: ['Orders']
  };
  
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(40, 40, 40, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#2e7d32'
    }
  };

  return (
    <ThemedView style={tabStyles.container}>
      <TabHeader title={t('analysis')} />
      
      <View style={styles.timeFilterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, timeRange === 'week' && styles.activeFilterButton]}
          onPress={() => setTimeRange('week')}
        >
          <ThemedText style={[styles.filterText, timeRange === 'week' && styles.activeFilterText]}>
            {t('week')}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, timeRange === 'month' && styles.activeFilterButton]}
          onPress={() => setTimeRange('month')}
        >
          <ThemedText style={[styles.filterText, timeRange === 'month' && styles.activeFilterText]}>
            {t('month')}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, timeRange === 'year' && styles.activeFilterButton]}
          onPress={() => setTimeRange('year')}
        >
          <ThemedText style={[styles.filterText, timeRange === 'year' && styles.activeFilterText]}>
            Year
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={tabStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>Orders Summary</ThemedText>
          <BarChart
            data={barData}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />
        </View>
        
        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>Orders Over Time</ThemedText>
          <LineChart
            data={lineData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>124</ThemedText>
            <ThemedText style={styles.statLabel}>{t('totalOrders')}</ThemedText>
          </View>
          
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>98</ThemedText>
            <ThemedText style={styles.statLabel}>{t('completed')}</ThemedText>
          </View>
          
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>$15,420</ThemedText>
            <ThemedText style={styles.statLabel}>Total Spent</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  timeFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F5F7FA',
  },
  activeFilterButton: {
    backgroundColor: '#E8F5E9',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
    color: '#777777',
  },
  activeFilterText: {
    color: '#2E7D32',
    fontFamily: 'Comfortaa-SemiBold',
  },
  chartContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Comfortaa-SemiBold',
    marginBottom: 16,
    color: '#282828',
  },
  chart: {
    borderRadius: 16,
    padding: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: '3%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Comfortaa-SemiBold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Comfortaa-Medium',
    color: '#777777',
    textAlign: 'center',
  },
});
