import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from '@/translations/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '@/api/client';
import orderService, { OrderDetail } from '@/api/orderService';
// Import components
import OrderMapView from '../components/OrderMapView';
import FullScreenMapModal from '../components/FullScreenMapModal';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const userRole = apiClient.getUserRole();
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const orderData = await orderService.getOrderById(id);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  // Handle status update (for driver)
  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      await orderService.updateOrderStatus(id, newStatus);
      // Refetch order details to get the updated data
      const updatedOrder = await orderService.getOrderById(id);
      console.log('Updated order:', updatedOrder);
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#35B468" />
      </ThemedView>
    );
  }
  
  if (error || !order) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>{error || 'Order not found'}</ThemedText>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>{t('cancel')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          title: `${t('orderDetails')} #${order.order_id}`,
          headerTitleStyle: {
            fontFamily: 'Comfortaa-SemiBold',
            color: '#282828',
          },
          headerTintColor: '#35B468',
          headerShown: true,
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Order Status */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('status')}</ThemedText>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(order.status) }
          ]}>
            <ThemedText style={styles.statusText}>{order.status}</ThemedText>
          </View>
        </View>
        
        {/* Order Details */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('orderDetails')}</ThemedText>
          <View style={styles.card}>
            <DetailRow label={t('orderId')} value={order.order_id} />
            <DetailRow label={t('date')} value={order.date} />
            <DetailRow label={t('price')} value={`$${order.price.toLocaleString()}`} />
            <DetailRow label={t('product')} value={order.product_type} />
            <DetailRow label={t('weight')} value={order.weight} />
            <DetailRow label={t('vehicle')} value={order.vehicle_type} />
          </View>
        </View>
        
        {/* Locations - Clickable for drivers */}
        <View style={styles.section}>
          {userRole === 'driver' ? (
            <TouchableOpacity 
              style={styles.locationHeaderTouch} 
              onPress={() => setMapModalVisible(true)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.sectionTitle}>{t('locations')}</ThemedText>
              <MaterialIcons name="map" size={20} color="#35B468" />
            </TouchableOpacity>
          ) : (
            <ThemedText style={styles.sectionTitle}>{t('locations')}</ThemedText>
          )}
          <View style={styles.card}>
            <DetailRow label={t('origin')} value={order.origin.name} />
            <DetailRow label={t('destination')} value={order.destination.name} />
            
            {order.estimated_arrival && (
              <DetailRow label={t('eta')} value={order.estimated_arrival} />
            )}
            
            {order.delivered_on && (
              <DetailRow label={t('deliveredOn')} value={order.delivered_on} />
            )}
          </View>
          
          {/* Show a hint for drivers */}
          {userRole === 'driver' && (
            <TouchableOpacity 
              style={styles.viewMapButton} 
              onPress={() => setMapModalVisible(true)}
            >
              <ThemedText style={styles.viewMapText}>{t('viewFullMap')}</ThemedText>
              <MaterialIcons name="open-in-full" size={16} color="#35B468" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Map View for Drivers */}
        {userRole === 'driver' && (
          <View style={styles.mapSection}>
            <OrderMapView 
              origin={{
                latitude: order.origin?.latitude || 43.2200, 
                longitude: order.origin?.longitude || 76.8513,
                address: order.origin?.name
              }}
              destination={{
                latitude: order.destination?.latitude || 43.2551, 
                longitude: order.destination?.longitude || 76.9126,
                address: order.destination?.name
              }}
              status={order.status}
            />
          </View>
        )}
        
        {/* Customer Details */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('customer')}</ThemedText>
          <View style={styles.card}>
            <DetailRow 
              label={t('fullName')} 
              value={`${order.customer.first_name} ${order.customer.last_name}`} 
            />
            <DetailRow label={t('email')} value={order.customer.email} />
          </View>
        </View>
        
        {/* Driver Details (if assigned) */}
        {order.driver && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('driver')}</ThemedText>
            <View style={styles.card}>
              <DetailRow 
                label={t('fullName')} 
                value={`${order.driver.first_name} ${order.driver.last_name}`} 
              />
              <DetailRow label={t('email')} value={order.driver.email} />
            </View>
          </View>
        )}
        
        {/* Actions for driver */}
        {userRole === 'driver' && order.status === 'in-progress' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('actions')}</ThemedText>
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => handleUpdateStatus('completed')}
              >
                <ThemedText style={styles.actionButtonText}>{t('markAsCompleted')}</ThemedText>
              </TouchableOpacity>
            
            </View>
          </View>
        )}
        
        {/* Actions for driver - accept new orders */}
        {userRole === 'driver' && order.status === 'new' && !order.driver && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('actions')}</ThemedText>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleUpdateStatus('in-progress')}
            >
              <ThemedText style={styles.actionButtonText}>{t('acceptOrder')}</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Full Screen Map Modal */}
      {order && (
        <FullScreenMapModal
          visible={mapModalVisible}
          onClose={() => setMapModalVisible(false)}
          origin={{
            latitude: order.origin?.latitude || 43.2200, 
            longitude: order.origin?.longitude || 76.8513,
            name: order.origin?.name,
          }}
          destination={{
            latitude: order.destination?.latitude || 43.2551, 
            longitude: order.destination?.longitude || 76.9126,
            name: order.destination?.name,
          }}
          status={order.status}
        />
      )}
    </ThemedView>
  );
}

// Helper component for detail rows
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <ThemedText style={styles.detailLabel}>{label}:</ThemedText>
    <ThemedText style={styles.detailValue}>{value}</ThemedText>
  </View>
);

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return '#3498db'; // Blue
    case 'in-progress':
      return '#f39c12'; // Orange
    case 'completed':
      return '#2ecc71'; // Green
    case 'cancelled':
      return '#e74c3c'; // Red
    default:
      return '#95a5a6'; // Gray
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
  },
  mapSection: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  locationHeaderTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(53, 180, 104, 0.1)',
  },
  viewMapText: {
    color: '#35B468',
    marginRight: 5,
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Comfortaa-SemiBold',
    color: '#282828',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
    color: '#777777',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
    color: '#282828',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
    color: '#FFFFFF',
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  acceptButton: {
    backgroundColor: '#35B468',
  },
  completeButton: {
    backgroundColor: '#35B468',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
  actionButtonText: {
    fontFamily: 'Comfortaa-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Comfortaa-Medium',
    color: '#E74C3C',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#35B468',
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Comfortaa-SemiBold',
    color: '#FFFFFF',
  },
});
