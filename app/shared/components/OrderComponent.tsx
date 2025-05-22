import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Order } from '@/api/orderService';
import { useTranslation } from '@/translations/useTranslation';

interface OrderComponentProps {
  order: Order;
  onPress?: (order: Order) => void;
  showDetails?: boolean;
}

export const OrderComponent: React.FC<OrderComponentProps> = ({ 
  order, 
  onPress, 
  showDetails = false 
}) => {
  const { t } = useTranslation();
  // Status colors for visual indication
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
  
  // Get localized status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return t('newOrders');
      case 'in-progress': return t('inProgress');
      case 'completed': return t('completed');
      case 'cancelled': return t('cancelled');
      default: return status;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(order)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <ThemedText style={styles.orderId}>{t('orderId')} #{order.order_id}</ThemedText>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(order.status) }
        ]}>
          <ThemedText style={styles.statusText}>{getStatusText(order.status)}</ThemedText>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>{t('origin')}:</ThemedText>
          <ThemedText style={styles.value}>{order.origin_name}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>{t('destination')}:</ThemedText>
          <ThemedText style={styles.value}>{order.destination_name}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>{t('product')}:</ThemedText>
          <ThemedText style={styles.value}>{order.product_type}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>{t('vehicle')}:</ThemedText>
          <ThemedText style={styles.value}>{order.vehicle_type}</ThemedText>
        </View>
      </View>
      
      <View style={styles.footer}>
        <ThemedText style={styles.price}>${order.price.toLocaleString()}</ThemedText>
        <ThemedText style={styles.date}>{order.date}</ThemedText>
      </View>
      
      {showDetails && order.driver_name && (
        <View style={styles.additionalDetails}>
          <View style={styles.detailRow}>
            <ThemedText style={styles.label}>{t('driver')}:</ThemedText>
            <ThemedText style={styles.value}>{order.driver_name}</ThemedText>
          </View>
          
          {order.estimated_arrival && (
            <View style={styles.detailRow}>
              <ThemedText style={styles.label}>{t('eta')}:</ThemedText>
              <ThemedText style={styles.value}>{order.estimated_arrival}</ThemedText>
            </View>
          )}
          
          {order.delivered_on && (
            <View style={styles.detailRow}>
              <ThemedText style={styles.label}>{t('deliveredOn')}:</ThemedText>
              <ThemedText style={styles.value}>{order.delivered_on}</ThemedText>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Comfortaa-SemiBold',
    color: '#282828',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Comfortaa-Medium',
    color: '#FFFFFF',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 80,
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
    color: '#777777',
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
    color: '#282828',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  price: {
    fontSize: 18,
    fontFamily: 'Comfortaa-SemiBold',
    color: '#35B468',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Comfortaa-Regular',
    color: '#777777',
  },
  additionalDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});
