import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HeaderLanguageSwitcher } from '@/components/HeaderLanguageSwitcher';
import { OrderComponent } from '@/app/shared/components/OrderComponent';
import orderService, { Order } from '@/api/orderService';
import { useTranslation } from '@/translations/useTranslation';
import { Colors } from '@/constants/Colors';

export default function MyOrders() {
  const router = useRouter();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      // Handle the response data - assuming it's either an array or has a results property
      const orderData = Array.isArray(response) ? response : response.results || [];
      setOrders(orderData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Map API statuses to friendly display names
  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return t('newOrders');
      case 'in-progress': return t('inProgress');
      case 'completed': return t('completed');
      case 'cancelled': return t('cancelled');
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      return ['new', 'in-progress'].includes(order.status);
    } else if (activeTab === 'completed') {
      return order.status === 'completed';
    } else {
      return order.status === 'cancelled';
    }
  });

  // Navigate to order details
  const handleOrderPress = (order: Order) => {
    router.push(`/shared/order-details/${order.id}`);
  };
  
  // Render an order item using the shared component
  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderComponent 
      order={item}
      onPress={handleOrderPress}
      showDetails={true}
    />
  );

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#35B468" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            {t('inProgress')}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            {t('completed')}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            {t('cancelled')}
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {activeTab === 'active' 
              ? t('noOrdersFound')
              : activeTab === 'completed' 
                ? t('noOrdersFound')
                : t('noOrdersFound')}
          </ThemedText>
          {activeTab === 'active' && (
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <ThemedText style={styles.refreshText}>{t('continue')}</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#35B468']}
              tintColor="#35B468"
            />
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    padding: 16,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 16,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
    color: '#777777',
  },
  activeTabText: {
    fontFamily: 'Comfortaa-SemiBold',
    color: '#282828',
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#35B468',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  refreshText: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
