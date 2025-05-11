import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { TabHeader } from '@/components/tabs/TabHeader';
import { OrderItem } from '@/components/orders/OrderItem';
import { OrderFilters, FilterParams } from '@/components/orders/OrderFilters';

// Import mock data
const orderData = require('../mock-data/orders.json');

// Define type for order items
type OrderStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';

interface OrderItem {
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

export default function OrdersScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('new');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    vehicleType: null,
    productType: null,
    origin: null,
    destination: null,
    priceRange: null,
  });
  
  // Extract unique values for filter options
  const extractFilterOptions = (data: OrderItem[], key: keyof OrderItem) => {
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
  const allOrders = [...orderData.newOrders, ...orderData.myOrders] as OrderItem[];
  const activeTabOrders = activeTab === 'new' ? orderData.newOrders : orderData.myOrders;
  
  const vehicleTypeOptions = extractFilterOptions(allOrders, 'vehicleType');
  const productTypeOptions = extractFilterOptions(allOrders, 'productType');
  const originOptions = extractFilterOptions(allOrders, 'origin');
  const destinationOptions = extractFilterOptions(allOrders, 'destination');
  
  // Filter my orders by status when needed
  const getMyOrdersByStatus = (status: string) => {
    if (status === 'all') return orderData.myOrders;
    return orderData.myOrders.filter((order: OrderItem) => order.status === status);
  };
  
  // Helper function for price range filter
  const filterByPriceRange = (order: OrderItem, range: string | null) => {
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
  
  // Apply all filters to the orders
  const getFilteredOrders = () => {
    let filteredOrders = activeTab === 'new' 
      ? orderData.newOrders 
      : getMyOrdersByStatus(statusFilter);
    
    // Apply advanced filters if they are set
    if (filterParams.vehicleType) {
      filteredOrders = filteredOrders.filter((order: OrderItem) => 
        order.vehicleType === filterParams.vehicleType
      );
    }
    
    if (filterParams.productType) {
      filteredOrders = filteredOrders.filter((order: OrderItem) => 
        order.productType === filterParams.productType
      );
    }
    
    if (filterParams.origin) {
      filteredOrders = filteredOrders.filter((order: OrderItem) => 
        order.origin === filterParams.origin
      );
    }
    
    if (filterParams.destination) {
      filteredOrders = filteredOrders.filter((order: OrderItem) => 
        order.destination === filterParams.destination
      );
    }
    
    // Apply price range filter
    filteredOrders = filteredOrders.filter((order: OrderItem) => 
      filterByPriceRange(order, filterParams.priceRange)
    );
    
    return filteredOrders;
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
  
  const handleFilterChange = (type: keyof FilterParams, value: string | null) => {
    setFilterParams(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const renderMyOrdersStatusFilters = () => {
    const statusFilters = [
      { id: 'all', label: t('all') },
      { id: 'in-progress', label: t('inProgress') },
      { id: 'completed', label: t('completed') },
      { id: 'cancelled', label: t('cancelled') }
    ];
    
    return (
      <View style={styles.statusFiltersContainer}>
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
  
  return (
    <ThemedView style={tabStyles.container}>
      <TabHeader title={t('orders')} />
      
      {/* Tab Navigation */}
      <View style={tabStyles.tabContainer}>
        <TouchableOpacity 
          style={[tabStyles.tab, activeTab === 'new' && tabStyles.activeTab]}
          onPress={() => {
            setActiveTab('new');
            setSelectedOrder(null);
          }}
        >
          <ThemedText style={[tabStyles.tabText, activeTab === 'new' && tabStyles.activeTabText]}>
            {t('newOrders')}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[tabStyles.tab, activeTab === 'my' && tabStyles.activeTab]}
          onPress={() => {
            setActiveTab('my');
            setSelectedOrder(null);
          }}
        >
          <ThemedText style={[tabStyles.tabText, activeTab === 'my' && tabStyles.activeTabText]}>
            {t('myOrders')}
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Status Filters for My Orders */}
      {activeTab === 'my' && renderMyOrdersStatusFilters()}
      
      {/* Toggle Advanced Filters Button */}
      <View style={styles.advancedFiltersToggleContainer}>
        <TouchableOpacity 
          style={styles.advancedFiltersToggle}
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <ThemedText style={styles.advancedFiltersToggleText}>
            {showAdvancedFilters ? t('hideFilters') : t('showFilters')}
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Advanced Filters */}
      {showAdvancedFilters && (
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
      )}
      
      {/* Orders List */}
      <FlatList
        data={getFilteredOrders()}
        renderItem={({ item }) => (
          <OrderItem
            {...item}
            isSelected={selectedOrder === item.id}
            onSelect={handleOrderSelection}
            onViewDetails={handleViewOrderDetails}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {activeTab === 'new' ? t('noNewOrders') : t('noOrdersFound')}
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  statusFiltersContainer: {
    paddingHorizontal: 20,
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
    backgroundColor: '#FFFFFF',
  },
  activeStatusFilterButton: {
    backgroundColor: tabStyles.actionButton.backgroundColor,
  },
  statusFilterText: {
    fontSize: 14,
    color: '#777777',
  },
  activeStatusFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  advancedFiltersToggleContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  advancedFiltersToggle: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  advancedFiltersToggleText: {
    fontSize: 14,
    color: '#282828',
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777777',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Comfortaa',
  },
});
