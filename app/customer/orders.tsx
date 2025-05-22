import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { TabHeader } from '@/components/tabs/TabHeader';
import { OrderItem } from '@/components/orders/OrderItem';
import { OrderFilters, FilterParams } from '@/components/orders/OrderFilters';
import { MaterialIcons } from '@expo/vector-icons';

// Import the order service for API calls
import orderService, { Order } from '@/api/orderService';

// Mock data for initial state to prevent undefined errors
const MOCK_ORDERS: Order[] = [];

// Map API Order type to the component's expected format
interface OrderItemExtended {
  id: string;
  orderId: string;
  customer: string;
  origin: string;
  destination: string;
  vehicleType: string;
  productType: string;
  weight: string;
  price: number;
  status: string;
  date: string;
  driverName?: string;
  estimatedArrival?: string;
  deliveredOn?: string;
  reason?: string;
}

// Function to map API Order to component's expected format
const mapApiOrderToComponentOrder = (order: Order | undefined): OrderItemExtended => {
  if (!order) {
    // Return a placeholder to prevent errors if order is undefined
    return {
      id: '0',
      orderId: '',
      customer: '',
      origin: '',
      destination: '',
      vehicleType: '',
      productType: '',
      weight: '',
      price: 0,
      status: 'new',
      date: ''
    };
  }
  return {
    id: order.id,
    orderId: order.order_id,
    customer: order.customer_name,
    origin: order.origin_name,
    destination: order.destination_name,
    vehicleType: order.vehicle_type,
    productType: order.product_type,
    weight: order.weight,
    price: order.price,
    status: order.status,
    date: order.date,
    driverName: order.driver_name,
    estimatedArrival: order.estimated_arrival,
    deliveredOn: order.delivered_on,
    reason: order.reason
  };
};

export default function OrdersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  
  // State variables
  const [activeTab, setActiveTab] = useState(
    params.tab ? String(params.tab) : 'new'
  );
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState(
    params.status ? String(params.status) : 'all'
  );
  
  // State for API data
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data from the respective API endpoints
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Initialize with empty arrays to prevent undefined errors
        if (activeTab === 'new' && !newOrders) {
          setNewOrders([]);
        } else if (activeTab === 'my' && !myOrders) {
          setMyOrders([]);
        }
        
        // Fetch new orders
        if (activeTab === 'new') {
          try {
            const newOrdersData = await orderService.getNewOrders();
            // Ensure we're setting a valid array
            setNewOrders(newOrdersData.results);
          } catch (fetchError) {
            console.error('Error fetching new orders:', fetchError);
            // Make sure we at least have an empty array
            setNewOrders([]);
            throw fetchError;
          }
        } 
        // Fetch my orders
        else {
          try {
            const myOrdersData = await orderService.getMyOrders();
            setMyOrders(myOrdersData.results);
          } catch (fetchError) {
            console.error('Error fetching my orders:', fetchError);
            // Make sure we at least have an empty array
            setMyOrders([]);
            throw fetchError;
          }
        }
      } catch (err) {
        console.error('Error in order fetching process:', err);
        setError('Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [activeTab]); // Re-fetch when tab changes
  
  // Filter params from order-filter page
  const [filterParams, setFilterParams] = useState<FilterParams>({
    vehicleType: params.vehicleType ? String(params.vehicleType) : null,
    productType: params.productType ? String(params.productType) : null,
    origin: params.origin ? String(params.origin) : null,
    destination: params.destination ? String(params.destination) : null,
    priceRange: params.priceRange ? String(params.priceRange) : null,
  });
  
  const [searchQuery, setSearchQuery] = useState<string>(
    params.searchQuery ? String(params.searchQuery) : ''
  );
  
  // Count active filters for badge display
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filterParams.vehicleType) count++;
    if (filterParams.productType) count++;
    if (filterParams.origin) count++;
    if (filterParams.destination) count++;
    if (filterParams.priceRange) count++;
    if (searchQuery) count++;
    if (activeTab === 'my' && statusFilter !== 'all') count++;
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  
  // Extract unique values for filter options with null check
  const extractFilterOptions = (data: Order[], key: keyof Order) => {
    const uniqueValues = new Set<string>();
    if (!data || !Array.isArray(data)) {
      return [];
    }
    data.forEach(item => {
      if (item && item[key]) {
        uniqueValues.add(String(item[key]));
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

  // Make sure we have arrays before mapping
  // This is a more thorough check
  const safeNewOrders = Array.isArray(newOrders) ? newOrders : [];
  const safeMyOrders = Array.isArray(myOrders) ? myOrders : [];
  
  // Now map safely
  const mappedNewOrders = safeNewOrders.map(mapApiOrderToComponentOrder);
  const mappedMyOrders = safeMyOrders.map(mapApiOrderToComponentOrder);
  
  // Use our safe arrays for all operations
  const allOrders = [...safeNewOrders, ...safeMyOrders];
  const mappedAllOrders = [...mappedNewOrders, ...mappedMyOrders];
  const activeTabOrders = activeTab === 'new' ? safeNewOrders : safeMyOrders;
  const mappedActiveTabOrders = activeTab === 'new' ? mappedNewOrders : mappedMyOrders;
  
  const vehicleTypeOptions = extractFilterOptions(allOrders, 'vehicle_type');
  const productTypeOptions = extractFilterOptions(allOrders, 'product_type');
  const originOptions = extractFilterOptions(allOrders, 'origin_name');
  const destinationOptions = extractFilterOptions(allOrders, 'destination_name');
  
  // Filter my orders by status using our safe array
  const getMyOrdersByStatus = (status: string) => {
    if (status === 'all') return safeMyOrders;
    return safeMyOrders.filter((order: Order) => order.status === status);
  };
  
  // Helper function for price range filter
  const filterByPriceRange = (order: Order, range: string | null) => {
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
      ? newOrders 
      : getMyOrdersByStatus(statusFilter);
    
    // Apply search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filteredOrders = filteredOrders.filter((order: Order) => 
        order.order_id.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.origin_name.toLowerCase().includes(query) ||
        order.destination_name.toLowerCase().includes(query) ||
        order.vehicle_type.toLowerCase().includes(query) ||
        order.product_type.toLowerCase().includes(query)
      );
    }
    
    // Apply advanced filters if they are set
    if (filterParams.vehicleType) {
      filteredOrders = filteredOrders.filter((order: Order) => 
        order.vehicle_type === filterParams.vehicleType
      );
    }
    
    if (filterParams.productType) {
      filteredOrders = filteredOrders.filter((order: Order) => 
        order.product_type === filterParams.productType
      );
    }
    
    if (filterParams.origin) {
      filteredOrders = filteredOrders.filter((order: Order) => 
        order.origin_name === filterParams.origin
      );
    }
    
    if (filterParams.destination) {
      filteredOrders = filteredOrders.filter((order: Order) => 
        order.destination_name === filterParams.destination
      );
    }
    
    // Apply price range filter
    filteredOrders = filteredOrders.filter((order: Order) => 
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
    console.log('Viewing order details for ID:', id);
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
  
  const navigateToFilter = () => {
    // Pass all current filter parameters to the filter page
    const params: Record<string, string> = {
      tab: activeTab
    };
    
    if (searchQuery) {
      params.searchQuery = searchQuery;
    }
    
    if (activeTab === 'my' && statusFilter !== 'all') {
      params.status = statusFilter;
    }
    
    // Add filter parameters
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
    
    router.push({
      pathname: '/order-filter',
      params: params
    });
  };
    // Function to truncate text if it's longer than 17 characters
    const truncateText = (text: string): string => {
      return text.length > 17 ? text.substring(0, 14) + '...' : text;
    };
  
  // Show loading state while fetching orders
  if (loading) {
    return (
      <ThemedView style={[tabStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#35B468" />
        <ThemedText style={styles.loadingText}>Loading orders...</ThemedText>
      </ThemedView>
    );
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <ThemedView style={[tabStyles.container, styles.errorContainer]}>
        <MaterialIcons name="error-outline" size={60} color="#ff6b6b" />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setActiveTab(activeTab)} // This will trigger a re-fetch
        >
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={tabStyles.container}>
      <View style={styles.customHeader}>
        <ThemedText style={styles.headerTitle}>{t('orders')}</ThemedText>
        <TouchableOpacity onPress={navigateToFilter} style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="#FBFBFB" />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
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
            {truncateText(t('newOrders'))}
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
            {truncateText(t('myOrders'))}
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Orders List */}
      <FlatList
        data={getFilteredOrders()}
        renderItem={({ item }) => {
          // Map API order to component order format first
          const mappedOrder = mapApiOrderToComponentOrder(item);
          
          return (
            <OrderItem
              key={item.id}
              id={mappedOrder.id}
              orderId={mappedOrder.orderId}
              customer={mappedOrder.customer}
              origin={mappedOrder.origin}
              destination={mappedOrder.destination}
              vehicleType={mappedOrder.vehicleType}
              productType={mappedOrder.productType}
              weight={mappedOrder.weight}
              price={mappedOrder.price}
              status={mappedOrder.status}
              date={mappedOrder.date}
              driverName={mappedOrder.driverName}
              estimatedArrival={mappedOrder.estimatedArrival}
              deliveredOn={mappedOrder.deliveredOn}
              reason={mappedOrder.reason}
              isSelected={selectedOrder === item.id}
              onSelect={() => handleOrderSelection(item.id)}
              onViewDetails={() => handleViewOrderDetails(item.id)}
            />
          );
        }}
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
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#35B468',
  },
  tabText: {
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  filtersContainer: {
    padding: 15,
  },
  selectedOrderContainer: {
    backgroundColor: 'rgba(53, 180, 104, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#35B468',
  },
  badgeContainer: {
    backgroundColor: '#35B468',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statusFiltersContainer: {
    padding: 15,
    paddingTop: 5,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateIcon: {
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    color: '#ff6b6b',
  },
  retryButton: {
    backgroundColor: '#35B468',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: tabStyles.actionButton.backgroundColor,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Comfortaa',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5252',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FBFBFB',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Comfortaa',
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
