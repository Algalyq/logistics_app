import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { Card } from '@/components/tabs/Card';

// Mock function to fetch order by ID - this would be an API call in a real app
const fetchOrderById = (id: string) => {
  // This would be replaced with an API call in a real app
  const allOrders = [
    ...require('./mock-data/orders.json').newOrders,
    ...require('./mock-data/orders.json').myOrders
  ];
  return allOrders.find(order => order.id === id) || null;
};

export default function OrderConfirmScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [selectedDriver, setSelectedDriver] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Mock driver list data
  const availableDrivers = [
    { id: 'driver1', name: 'Nurzhan A.' },
    { id: 'driver2', name: 'Askar B.' },
    { id: 'driver3', name: 'Marat K.' }
  ];

  useEffect(() => {
    // In a real app, this would be an API call
    const orderData = fetchOrderById(orderId);
    setOrder(orderData);
    setLoading(false);
    
    // Default estimated date (5 days from now)
    const date = new Date();
    date.setDate(date.getDate() + 5);
    setEstimatedDate(date.toISOString().split('T')[0]);
  }, [orderId]);

  useEffect(() => {
    // Form validation
    setIsFormValid(!!selectedDriver && !!estimatedDate);
  }, [selectedDriver, estimatedDate]);

  const handleGoBack = () => {
    router.back();
  };

  const handleSubmitOrder = () => {
    // In a real app, this would submit the order to the backend
    console.log('Order confirmed:', {
      orderId,
      driverId: selectedDriver,
      estimatedDate,
      specialInstructions,
    });
    
    // Navigate back to the orders page
    router.push('/(tabs)/orders');
  };

  if (loading || !order) {
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

  return (
    <ThemedView style={tabStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Image 
            source={require('@/assets/images/icon.png')} // Replace with back icon
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{t('confirmOrder')}</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Order Summary */}
        <Card title={t('orderSummary')}>
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{t('orderNumber')}:</ThemedText>
            <ThemedText style={styles.detailValue}>{order.orderId}</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{t('customer')}:</ThemedText>
            <ThemedText style={styles.detailValue}>{order.customer}</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{t('origin')}:</ThemedText>
            <ThemedText style={styles.detailValue}>{order.origin}</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{t('destination')}:</ThemedText>
            <ThemedText style={styles.detailValue}>{order.destination}</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{t('vehicle')}:</ThemedText>
            <ThemedText style={styles.detailValue}>{order.vehicleType}</ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{t('weight')}:</ThemedText>
            <ThemedText style={styles.detailValue}>{order.weight}</ThemedText>
          </View>
          
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceLabel}>{t('total')}:</ThemedText>
            <ThemedText style={styles.priceValue}>${order.price}</ThemedText>
          </View>
        </Card>
        
        {/* Delivery Assignment Form */}
        <Card title={t('assignDelivery')}>
          {/* Driver Selection */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.formLabel}>{t('selectDriver')}:</ThemedText>
            <View style={styles.driverSelectionContainer}>
              {availableDrivers.map((driver) => (
                <TouchableOpacity
                  key={driver.id}
                  style={[
                    styles.driverOption,
                    selectedDriver === driver.id && styles.selectedDriverOption,
                  ]}
                  onPress={() => setSelectedDriver(driver.id)}
                >
                  <ThemedText
                    style={[
                      styles.driverText,
                      selectedDriver === driver.id && styles.selectedDriverText,
                    ]}
                  >
                    {driver.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Estimated Delivery Date */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.formLabel}>{t('estimatedDelivery')}:</ThemedText>
            <TextInput
              style={styles.textInput}
              value={estimatedDate}
              onChangeText={setEstimatedDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
          
          {/* Special Instructions */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.formLabel}>{t('specialInstructions')}:</ThemedText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder={t('enterSpecialInstructions')}
              multiline
              numberOfLines={4}
            />
          </View>
        </Card>
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleGoBack}
          >
            <ThemedText style={styles.actionButtonText}>{t('cancel')}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              styles.confirmButton,
              !isFormValid && styles.disabledButton
            ]}
            onPress={handleSubmitOrder}
            disabled={!isFormValid}
          >
            <ThemedText style={styles.actionButtonText}>{t('confirm')}</ThemedText>
          </TouchableOpacity>
        </View>
        
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
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#282828',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  driverSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  driverOption: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedDriverOption: {
    backgroundColor: tabStyles.actionButton.backgroundColor,
    borderColor: tabStyles.actionButton.backgroundColor,
  },
  driverText: {
    fontSize: 14,
    color: '#282828',
  },
  selectedDriverText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: tabStyles.actionButton.backgroundColor,
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
