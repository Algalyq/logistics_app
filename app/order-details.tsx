import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { Card } from '@/components/tabs/Card';

// Mock function to fetch order by ID
const fetchOrderById = (id: string) => {
  // This would be replaced with an API call in a real app
  const allOrders = [
    ...require('./mock-data/orders.json').newOrders,
    ...require('./mock-data/orders.json').myOrders
  ];
  return allOrders.find(order => order.id === id) || null;
};

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const orderData = fetchOrderById(orderId);
    setOrder(orderData);
    setLoading(false);
  }, [orderId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleAcceptOrder = () => {
    router.push({
      pathname: '/order-confirm',
      params: { id: orderId }
    });
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'in-progress': return t('inProgress');
      case 'completed': return t('completed');
      case 'cancelled': return t('cancelled');
      default: return t('newOrders');
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'new': return styles.newBadge;
      case 'in-progress': return styles.inProgressBadge;
      case 'completed': return styles.completedBadge;
      case 'cancelled': return styles.cancelledBadge;
      default: return {};
    }
  };

  if (loading) {
    return (
      <ThemedView style={tabStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Image 
              source={require('@/assets/images/icon.png')} // Replace with back icon
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('loading')}</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>{t('loading')}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!order) {
    return (
      <ThemedView style={tabStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Image 
              source={require('@/assets/images/icon.png')} // Replace with back icon
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('orderNotFound')}</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>{t('orderNotFound')}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={tabStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Image 
            source={require('@/assets/images/icon.png')} // Replace with back icon
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{t('orderDetails')}</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Order Status */}
        <Card>
          <View style={styles.orderHeader}>
            <ThemedText style={styles.orderId}>{order.orderId}</ThemedText>
            <View style={[styles.statusBadge, getStatusBadgeStyle(order.status)]}>
              <ThemedText style={styles.statusText}>
                {getStatusText(order.status)}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{t('date')}:</ThemedText>
            <ThemedText style={styles.detailValue}>{order.date}</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{t('customer')}:</ThemedText>
            <ThemedText style={styles.detailValue}>{order.customer}</ThemedText>
          </View>
          
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceLabel}>{t('total')}:</ThemedText>
            <ThemedText style={styles.priceValue}>${order.price}</ThemedText>
          </View>
        </Card>
        
        {/* Route Information */}
        <Card title={t('routeInformation')}>
          <View style={styles.routeContainer}>
            <View style={styles.locationColumn}>
              <View style={styles.locationDot} />
              <View style={styles.locationLine} />
              <View style={[styles.locationDot, styles.destinationDot]} />
            </View>
            <View style={styles.routeDetails}>
              <View style={styles.locationInfo}>
                <ThemedText style={styles.locationLabel}>{t('origin')}:</ThemedText>
                <ThemedText style={styles.locationValue}>{order.origin}</ThemedText>
              </View>
              <View style={styles.locationInfo}>
                <ThemedText style={styles.locationLabel}>{t('destination')}:</ThemedText>
                <ThemedText style={styles.locationValue}>{order.destination}</ThemedText>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Cargo Details */}
        <Card title={t('cargoDetails')}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailsColumn}>
              <ThemedText style={styles.detailsLabel}>{t('vehicle')}:</ThemedText>
              <ThemedText style={styles.detailsValue}>{order.vehicleType}</ThemedText>
            </View>
            <View style={styles.detailsColumn}>
              <ThemedText style={styles.detailsLabel}>{t('product')}:</ThemedText>
              <ThemedText style={styles.detailsValue}>{order.productType}</ThemedText>
            </View>
            <View style={styles.detailsColumn}>
              <ThemedText style={styles.detailsLabel}>{t('weight')}:</ThemedText>
              <ThemedText style={styles.detailsValue}>{order.weight}</ThemedText>
            </View>
          </View>
        </Card>
        
        {/* Delivery Information */}
        {order.status === 'in-progress' && (
          <Card title={t('deliveryInformation')}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('driver')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.driverName}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('eta')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.estimatedArrival}</ThemedText>
            </View>
          </Card>
        )}
        
        {order.status === 'completed' && (
          <Card title={t('deliveryInformation')}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('deliveredOn')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.deliveredOn}</ThemedText>
            </View>
          </Card>
        )}
        
        {order.status === 'cancelled' && (
          <Card title={t('cancellationDetails')}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('reason')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.reason}</ThemedText>
            </View>
          </Card>
        )}
        
        {/* Action Buttons */}
        {order.status === 'new' && (
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={handleAcceptOrder}
            >
              <ThemedText style={styles.actionButtonText}>
                {t('acceptOrder')}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
              <ThemedText style={styles.actionButtonText}>
                {t('reject')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
        
        {order.status === 'in-progress' && (
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>
              {t('trackOrder')}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: tabStyles.actionButton.backgroundColor,
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
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Comfortaa',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#777777',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282828',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadge: {
    backgroundColor: '#E0F7FA',
  },
  inProgressBadge: {
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
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#777777',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#282828',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#777777',
    marginRight: 8,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: tabStyles.actionButton.backgroundColor,
  },
  routeContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  locationColumn: {
    width: 24,
    alignItems: 'center',
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
    height: 40,
    backgroundColor: '#DDDDDD',
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  locationInfo: {
    marginBottom: 10,
  },
  locationLabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282828',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailsColumn: {
    width: '33%',
    paddingVertical: 8,
  },
  detailsLabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282828',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    backgroundColor: tabStyles.actionButton.backgroundColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: tabStyles.actionButton.backgroundColor,
  },
  rejectButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
