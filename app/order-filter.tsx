import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { OrderFilters, FilterParams } from '@/components/orders/OrderFilters';
import { OrderItem } from '@/components/orders/OrderItem';
import { tabStyles } from '@/assets/styles/tabStyles';
import { COLORS } from '@/assets/styles/authStyles';
import { useTranslation } from '@/translations/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';

// Import mock data
const orderData = require('./mock-data/orders.json');

// Define type for order items
type OrderStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';

interface OrderItemType {
  id: string;
  orderId: string;
  customer: string;
  origin: string;
  destination: string;
  vehicleType: string;
  productType: string;
  weight: string;
  price: number;
  status: OrderStatus;
  date: string;
  driverName?: string;
  estimatedArrival?: string;
  deliveredOn?: string;
  reason?: string;
}

export default function OrderFilterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const initialTab = (params?.tab as string) || 'new';
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(
    params?.searchQuery ? String(params.searchQuery) : ''
  );
  const [activeTab, setActiveTab] = useState(initialTab);
  const [statusFilter, setStatusFilter] = useState(params?.status as string || 'all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<OrderItemType[]>([]);
  
  // Advanced filter states
  const [filterParams, setFilterParams] = useState<FilterParams>({
    vehicleType: params?.vehicleType ? String(params.vehicleType) : null,
    productType: params?.productType ? String(params.productType) : null,
    origin: params?.origin ? String(params.origin) : null,
    destination: params?.destination ? String(params.destination) : null,
    priceRange: params?.priceRange ? String(params.priceRange) : null,
  });
  
  // Render status filters for My Orders
  const renderStatusFilters = () => {
    const statusFilters = [
      { id: 'all', label: t('all') },
      { id: 'in-progress', label: t('inProgress') },
      { id: 'completed', label: t('completed') },
      { id: 'cancelled', label: t('cancelled') }
    ];
    
    return (
      <View style={styles.statusFiltersContainer}>
        <ThemedText style={styles.filtersTitle}>{t('status')}</ThemedText>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusFiltersScrollContent}
        >
          {statusFilters.map(filter => (
            <TouchableOpacity 
              key={filter.id}
              style={[
                styles.statusFilterButton, 
                statusFilter === filter.id && styles.activeStatusFilterButton
              ]}
              onPress={() => setStatusFilter(filter.id)}
            >
              <ThemedText style={[
                styles.statusFilterText,
                statusFilter === filter.id && styles.activeStatusFilterText
              ]}>
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  // Extract unique values for filter options
  const extractFilterOptions = (data: OrderItemType[], key: keyof OrderItemType) => {
    const uniqueValues = new Set<string>();
    data.forEach(item => {
      if (item[key]) {
        uniqueValues.add(item[key] as string);
      }
    });
    return Array.from(uniqueValues).map(value => ({
      id: value,
      label: value,
    }));
  };

  // Price range options
  const priceRangeOptions = [
    { id: 'low', label: '< $500' },
    { id: 'medium', label: '$500 - $1000' },
    { id: 'high', label: '> $1000' },
  ];

  // Calculate filter options based on the active tab data
  const allOrders = [...orderData.newOrders, ...orderData.myOrders] as OrderItemType[];
  
  const vehicleTypeOptions = extractFilterOptions(allOrders, 'vehicleType');
  const productTypeOptions = extractFilterOptions(allOrders, 'productType');
  const originOptions = extractFilterOptions(allOrders, 'origin');
  const destinationOptions = extractFilterOptions(allOrders, 'destination');
  
  // Helper function for price range filter
  const filterByPriceRange = (order: OrderItemType, range: string | null) => {
    if (!range) return true;
    
    switch (range) {
      case 'low':
        return order.price < 500;
      case 'medium':
        return order.price >= 500 && order.price <= 1000;
      case 'high':
        return order.price > 1000;
      default:
        return true;
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleFilterChange = (type: keyof FilterParams, value: string | null) => {
    setFilterParams(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handleOrderSelection = (id: string) => {
    if (selectedOrder === id) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(id);
    }
  };
  
  const handleViewOrderDetails = (id: string) => {
    router.push({
      pathname: '/order-details',
      params: { id }
    });
  };
  

  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const clearAllFilters = () => {
    setFilterParams({
      vehicleType: null,
      productType: null,
      origin: null,
      destination: null,
      priceRange: null,
    });
    setSearchQuery('');
  };
  
  // Get preview of filtered orders for this page
  const updateFilteredOrdersPreview = () => {
    const sourceOrders = activeTab === 'new' ? orderData.newOrders : orderData.myOrders;
    
    let result = [...sourceOrders];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((order: OrderItemType) => 
        order.orderId.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.origin.toLowerCase().includes(query) ||
        order.destination.toLowerCase().includes(query) ||
        order.vehicleType.toLowerCase().includes(query) ||
        order.productType.toLowerCase().includes(query)
      );
    }
    
    // Apply advanced filters
    if (filterParams.vehicleType) {
      result = result.filter((order: OrderItemType) => 
        order.vehicleType === filterParams.vehicleType
      );
    }
    
    if (filterParams.productType) {
      result = result.filter((order: OrderItemType) => 
        order.productType === filterParams.productType
      );
    }
    
    if (filterParams.origin) {
      result = result.filter((order: OrderItemType) => 
        order.origin === filterParams.origin
      );
    }
    
    if (filterParams.destination) {
      result = result.filter((order: OrderItemType) => 
        order.destination === filterParams.destination
      );
    }
    
    // Apply price range filter
    result = result.filter((order: OrderItemType) => 
      filterByPriceRange(order, filterParams.priceRange)
    );
    
    setFilteredOrders(result);
  };
  
  // Update filtered orders when parameters change
  useEffect(() => {
    updateFilteredOrdersPreview();
  }, [searchQuery, filterParams, activeTab]);
  
  // Apply filters and navigate back to orders
  const applyFilters = () => {
    const params: Record<string, string> = {
      tab: activeTab
    };
    
    if (searchQuery) {
      params.searchQuery = searchQuery;
    }
    
    if (activeTab === 'my' && statusFilter !== 'all') {
      params.status = statusFilter;
    }
    
    if (filterParams.vehicleType) {
      params.vehicleType = filterParams.vehicleType;
    }
    
    if (filterParams.productType) {
      params.productType = filterParams.productType;
    }
    
    if (filterParams.origin) {
      params.origin = filterParams.origin;
    }
    
    if (filterParams.destination) {
      params.destination = filterParams.destination;
    }
    
    if (filterParams.priceRange) {
      params.priceRange = filterParams.priceRange;
    }
    
    router.replace({
      pathname: '/(tabs)/enhanced-orders',
      params
    });
  };
  
  // Render tab selector
  const renderTabSelector = () => {
    // Function to truncate text if it's longer than 17 characters
    const truncateText = (text: string): string => {
      return text.length > 17 ? text.substring(0, 14) + '...' : text;
    };

    return (
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'new' && styles.activeTabButton]}
          onPress={() => handleTabChange('new')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>
            {truncateText(t('newOrders'))}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
          onPress={() => handleTabChange('my')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            {truncateText(t('myOrders'))}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('filterSearch')}</ThemedText>
          <TouchableOpacity onPress={clearAllFilters} style={styles.clearButton}>
            <ThemedText style={styles.clearText}>{t('clear')}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        
        
        {/* Tab Selector */}
        {renderTabSelector()}
        
        {/* Status Filter (only for My Orders) */}
        {activeTab === 'my' && (
          <View>
            {renderStatusFilters()}
          </View>
        )}
        
        {/* Filters */}
        {/* <View style={styles.filtersContainer}> */}
          <ThemedText style={styles.filtersTitle}>{t('filters')}</ThemedText>

          <OrderFilters
            vehicleTypeFilter={filterParams.vehicleType}
            productTypeFilter={filterParams.productType}
            originFilter={filterParams.origin}
            destinationFilter={filterParams.destination}
            priceRangeFilter={filterParams.priceRange}
            onFilterChange={handleFilterChange}
            vehicleTypes={vehicleTypeOptions}
            productTypes={productTypeOptions}
            origins={originOptions}
            destinations={destinationOptions}
            priceRanges={priceRangeOptions}
          />
        {/* </View> */}
        
    
      </ScrollView>
      
      {/* Apply button */}
      <SafeAreaView style={styles.applyButtonContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <ThemedText style={styles.applyButtonText}>{t('applyFilters')}</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Comfortaa',
  },
  clearButton: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 12,
    color: '#FBFBFB',
    fontFamily: 'Comfortaa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Comfortaa',
    fontSize: 14,
    color: '#282828',
  },
  tabSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  activeTabButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282828',
    fontFamily: 'Comfortaa',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filtersContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#282828',
    fontFamily: 'Comfortaa',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#282828',
    fontFamily: 'Comfortaa',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#777',
    fontFamily: 'Comfortaa',
  },
  previewResults: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
  },
  previewText: {
    fontSize: 16,
    color: '#282828',
    fontFamily: 'Comfortaa',
    marginRight: 12,
  },
  applyButtonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  applyButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Comfortaa',
  },
  statusFiltersContainer: {
    marginBottom: 16,
  },
  statusFiltersScrollContent: {
    paddingRight: 20,
  },
  statusFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeStatusFilterButton: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  statusFilterText: {
    fontSize: 14,
    color: '#777777',
  },
  activeStatusFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
