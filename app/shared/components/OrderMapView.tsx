import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTranslation } from '@/translations/useTranslation';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

// Define the shape of location objects
interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface OrderMapViewProps {
  origin: Location;
  destination: Location;
  status: string;
}

const OrderMapView = ({ origin, destination, status }: OrderMapViewProps) => {
  const { t } = useTranslation();
  
  // Calculate position for the truck icon
  let truckPosition = 0.2; // Default position (20% along the path)
  if (status === 'in-progress') {
    truckPosition = 0.5; // Middle of the path
  } else if (status === 'completed') {
    truckPosition = 0.9; // End of the path
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{t('liveTracking')}</ThemedText>
      
      <View style={styles.mapPlaceholder}>
        {/* Simple visual representation of the route */}
        <View style={styles.routeContainer}>
          {/* Origin point */}
          <View style={styles.originPoint}>
            <MaterialIcons name="location-on" size={20} color="#22AA44" />
            <ThemedText style={styles.locationText}>{origin.address || t('origin')}</ThemedText>
          </View>
          
          {/* Route line with truck */}
          <View style={styles.routeLine}>
            <View style={[styles.truckContainer, { left: `${truckPosition * 100}%` }]}>
              <MaterialIcons name="local-shipping" size={20} color="white" />
            </View>
          </View>
          
          {/* Destination point */}
          <View style={styles.destinationPoint}>
            <MaterialIcons name="location-on" size={20} color="#AA2222" />
            <ThemedText style={styles.locationText}>{destination.address || t('destination')}</ThemedText>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoText}>
            {status === 'new' ? t('waitingForDriver') : 
             status === 'in-progress' ? t('estimatedArrival') : 
             status === 'completed' ? t('deliveryCompleted') : t('delivery')}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    padding: 10,
    fontSize: 16,
    fontFamily: 'Comfortaa-Medium',
    backgroundColor: '#35B468',
    color: 'white',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
    justifyContent: 'center',
  },
  routeContainer: {
    width: '100%',
    paddingVertical: 20,
  },
  originPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  destinationPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
  routeLine: {
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginVertical: 15,
    position: 'relative',
  },
  truckContainer: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#35B468',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }],
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  // Keep for backward compatibility
  truckIconContainer: {
    backgroundColor: '#35B468',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default OrderMapView;
