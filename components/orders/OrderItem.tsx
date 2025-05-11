import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from '@/translations/useTranslation';
import { tabStyles } from '@/assets/styles/tabStyles';

export interface OrderItemProps {
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
  isSelected: boolean;
  onSelect: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  id,
  orderId,
  customer,
  origin,
  destination,
  vehicleType,
  productType,
  weight,
  price,
  status,
  date,
  driverName,
  estimatedArrival,
  deliveredOn,
  reason,
  isSelected,
  onSelect,
  onViewDetails,
}) => {
  const { t } = useTranslation();

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'new':
        return styles.newBadge;
      case 'in-progress':
        return styles['in-progressBadge'];
      case 'completed':
        return styles.completedBadge;
      case 'cancelled':
        return styles.cancelledBadge;
      default:
        return {};
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'in-progress': 
        return t('inProgress');
      case 'completed': 
        return t('completed');
      case 'cancelled': 
        return t('cancelled');
      default: 
        return t('newOrders');
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.orderCard, isSelected && styles.selectedCard]}
      onPress={() => onSelect(id)}
    >
      <View style={styles.orderHeader}>
        <ThemedText style={styles.orderId}>{orderId}</ThemedText>
        <View style={[styles.statusBadge, getStatusBadgeStyle(status)]}>
          <ThemedText style={styles.statusText}>
            {getStatusText(status)}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.orderRow}>
        <ThemedText style={styles.orderLabel}>{t('customer')}:</ThemedText>
        <ThemedText style={styles.orderValue}>{customer}</ThemedText>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.locationColumn}>
          <View style={styles.locationDot} />
          <View style={styles.locationLine} />
          <View style={[styles.locationDot, styles.destinationDot]} />
        </View>
        <View style={styles.routeDetails}>
          <ThemedText style={styles.locationText}>{origin}</ThemedText>
          <ThemedText style={styles.locationText}>{destination}</ThemedText>
        </View>
      </View>
      
      <View style={styles.orderRow}>
        <View style={styles.orderDetail}>
          <ThemedText style={styles.detailLabel}>{t('vehicle')}</ThemedText>
          <ThemedText style={styles.detailValue}>{vehicleType}</ThemedText>
        </View>
        <View style={styles.orderDetail}>
          <ThemedText style={styles.detailLabel}>{t('product')}</ThemedText>
          <ThemedText style={styles.detailValue}>{productType}</ThemedText>
        </View>
        <View style={styles.orderDetail}>
          <ThemedText style={styles.detailLabel}>{t('weight')}</ThemedText>
          <ThemedText style={styles.detailValue}>{weight}</ThemedText>
        </View>
      </View>
      
      <View style={styles.priceRow}>
        <ThemedText style={styles.priceLabel}>{t('price')}:</ThemedText>
        <ThemedText style={styles.priceValue}>${price}</ThemedText>
      </View>
      
      {/* Extended details for selected order */}
      {isSelected && (
        <View style={styles.extendedDetails}>
          {status === 'in-progress' && (
            <>
              <View style={styles.orderRow}>
                <ThemedText style={styles.orderLabel}>{t('driver')}:</ThemedText>
                <ThemedText style={styles.orderValue}>{driverName}</ThemedText>
              </View>
              <View style={styles.orderRow}>
                <ThemedText style={styles.orderLabel}>{t('eta')}:</ThemedText>
                <ThemedText style={styles.orderValue}>{estimatedArrival}</ThemedText>
              </View>
            </>
          )}
          
          {status === 'completed' && (
            <View style={styles.orderRow}>
              <ThemedText style={styles.orderLabel}>{t('deliveredOn')}:</ThemedText>
              <ThemedText style={styles.orderValue}>{deliveredOn}</ThemedText>
            </View>
          )}
          
          {status === 'cancelled' && (
            <View style={styles.orderRow}>
              <ThemedText style={styles.orderLabel}>{t('reason')}:</ThemedText>
              <ThemedText style={styles.orderValue}>{reason}</ThemedText>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => onViewDetails(id)}
          >
            <ThemedText style={styles.actionButtonText}>
              {t('viewDetails')}
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    ...tabStyles.card,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: tabStyles.actionButton.backgroundColor,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282828',
    fontFamily: 'Comfortaa',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadge: {
    backgroundColor: '#E0F7FA',
  },
  'in-progressBadge': {
    backgroundColor: '#FFF9C4',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  cancelledBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#282828',
  },
  orderRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 14,
    color: '#777777',
    width: 80,
  },
  orderValue: {
    fontSize: 14,
    color: '#282828',
    fontWeight: '500',
    flex: 1,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  locationColumn: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tabStyles.actionButton.backgroundColor,
  },
  destinationDot: {
    backgroundColor: '#FF6B6B',
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: '#DDDDDD',
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
    height: 46,
  },
  locationText: {
    fontSize: 14,
    color: '#282828',
  },
  orderDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282828',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#777777',
    marginRight: 8,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: tabStyles.actionButton.backgroundColor,
  },
  extendedDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewDetailsButton: {
    backgroundColor: tabStyles.actionButton.backgroundColor,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
