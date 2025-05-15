import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Card } from '@/components/tabs/Card';

// Mock function to fetch order by ID (same as in order-details.tsx)
const fetchOrderById = (id: string) => {
  const allOrders = [
    ...require('./mock-data/orders.json').newOrders,
    ...require('./mock-data/orders.json').myOrders
  ];
  return allOrders.find(order => order.id === id) || null;
};

// Mock data for locations
type Location = {
  id: string;
  name: string;
  coordinates: [number, number]; // [x, y] position on our custom map (0-100 scale)
  city: string;
};

type MapPoint = {
  x: number;
  y: number;
};

const cityCoordinates: Record<string, MapPoint> = {
  'Almaty': { x: 75, y: 70 },
  'Nur-Sultan': { x: 45, y: 30 },
  'Shymkent': { x: 55, y: 85 },
  'Karaganda': { x: 60, y: 40 },
  'Taraz': { x: 45, y: 80 },
  'Atyrau': { x: 20, y: 50 },
  'Aktau': { x: 10, y: 65 },
  'Aktobe': { x: 25, y: 35 },
  'Oral': { x: 15, y: 25 },
  'Pavlodar': { x: 75, y: 25 },
  'Semey': { x: 85, y: 35 },
  'Oskemen': { x: 90, y: 40 },
};

// Get coordinates for a city name
const getCityCoordinates = (cityName: string): MapPoint => {
  return cityCoordinates[cityName] || { x: 50, y: 50 }; // Default to center if not found
};

// Generate points along the path from origin to destination
const generateRoutePath = (origin: MapPoint, destination: MapPoint, waypoints: number = 5): MapPoint[] => {
  const path: MapPoint[] = [origin];
  
  // Generate waypoints along the path with slight randomness
  for (let i = 1; i <= waypoints; i++) {
    const progress = i / (waypoints + 1);
    // Add some randomness to make the path not straight
    const randomX = Math.random() * 10 - 5; 
    const randomY = Math.random() * 10 - 5;
    
    path.push({
      x: origin.x + (destination.x - origin.x) * progress + randomX,
      y: origin.y + (destination.y - origin.y) * progress + randomY
    });
  }
  
  path.push(destination);
  return path;
};

// Calculate vehicle position along the route based on progress
const calculateVehiclePosition = (routePath: MapPoint[], progress: number): MapPoint => {
  if (routePath.length === 0) return { x: 50, y: 50 };
  if (routePath.length === 1) return routePath[0];
  
  // Normalize progress to 0-1 range
  const normalizedProgress = progress / 100;
  
  // Calculate which segment the truck is on
  const totalSegments = routePath.length - 1;
  const segmentIndex = Math.min(Math.floor(normalizedProgress * totalSegments), totalSegments - 1);
  
  // Calculate progress within the current segment
  const segmentProgress = (normalizedProgress * totalSegments) - segmentIndex;
  
  // Get the current and next points
  const currentPoint = routePath[segmentIndex];
  const nextPoint = routePath[segmentIndex + 1];
  
  // Interpolate position
  return {
    x: currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress,
    y: currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress
  };
};

// Mock function to calculate delivery progress (0 to 100)
const getDeliveryProgress = (): number => {
  // In a real app, this would be calculated based on distance/time
  return Math.floor(Math.random() * 70) + 10; // Return between 10% and 80%
};

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [routePath, setRoutePath] = useState<MapPoint[]>([]);
  const [truckPosition, setTruckPosition] = useState<MapPoint>({ x: 50, y: 50 });
  
  useEffect(() => {
    // Fetch order data
    const orderData = fetchOrderById(orderId);
    setOrder(orderData);
    
    if (orderData) {
      // Get current progress
      const currentProgress = getDeliveryProgress();
      setProgress(currentProgress);
      
      // Get coordinates for origin and destination
      const originCoords = getCityCoordinates(orderData.origin);
      const destCoords = getCityCoordinates(orderData.destination);
      
      // Generate route path
      const path = generateRoutePath(originCoords, destCoords);
      setRoutePath(path);
      
      // Calculate truck position based on progress
      const truckPos = calculateVehiclePosition(path, currentProgress);
      setTruckPosition(truckPos);
    }
    
    setLoading(false);
  }, [orderId]);
  
  const handleGoBack = () => {
    router.back();
  };
  
  // Estimated time remaining in minutes
  const getEstimatedTimeRemaining = (): number => {
    if (!order || !order.estimatedArrival) return 0;
    
    // This is just a simplified calculation for demonstration
    // In a real app, you would calculate this based on actual ETA and current time
    return Math.floor((100 - progress) / 100 * 120); // Assuming 120 minutes total journey
  };
  
  // Helper function to convert map coordinates to view coordinates
  const mapToViewCoords = (point: MapPoint, mapWidth: number, mapHeight: number): { x: number, y: number } => {
    return {
      x: (point.x / 100) * mapWidth,
      y: (point.y / 100) * mapHeight
    };
  };
  
  if (loading) {
    return (
      <ThemedView style={tabStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('trackOrder')}</ThemedText>
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
            <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" /> 
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('trackOrder')}</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>{t('orderNotFound')}</ThemedText>
        </View>
      </ThemedView>
    );
  }
  
  // Calculate map dimensions
  const mapWidth = Dimensions.get('window').width - 40; // 20px padding on each side
  const mapHeight = 220;
  
  return (
    <ThemedView style={tabStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{t('trackOrder')}</ThemedText>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Map Card */}
        <Card title={t('liveTracking')}>
          <View style={styles.mapContainer}>
            {/* Map Background */}
            <View style={styles.map}>
              {/* Draw Route Path */}
              {routePath.length > 1 && routePath.map((point, index) => {
                if (index === 0) return null; // Skip first point, we'll draw lines from prev to current
                
                const prevPoint = routePath[index - 1];
                const startCoords = mapToViewCoords(prevPoint, mapWidth, mapHeight);
                const endCoords = mapToViewCoords(point, mapWidth, mapHeight);
                
                return (
                  <View 
                    key={`path-${index}`}
                    style={[styles.routePath, {
                      left: startCoords.x,
                      top: startCoords.y,
                      width: Math.sqrt(Math.pow(endCoords.x - startCoords.x, 2) + Math.pow(endCoords.y - startCoords.y, 2)),
                      transform: [{
                        rotate: `${Math.atan2(endCoords.y - startCoords.y, endCoords.x - startCoords.x)}rad`
                      }]
                    }]}
                  />
                );
              })}
              
              {/* Origin Point */}
              {routePath.length > 0 && (
                <View 
                  style={[
                    styles.locationMarker,
                    styles.originMarker,
                    {
                      left: mapToViewCoords(routePath[0], mapWidth, mapHeight).x - 8,
                      top: mapToViewCoords(routePath[0], mapWidth, mapHeight).y - 8
                    }
                  ]}
                />
              )}
              
              {/* Destination Point */}
              {routePath.length > 1 && (
                <View 
                  style={[
                    styles.locationMarker,
                    styles.destinationMarker,
                    {
                      left: mapToViewCoords(routePath[routePath.length - 1], mapWidth, mapHeight).x - 8,
                      top: mapToViewCoords(routePath[routePath.length - 1], mapWidth, mapHeight).y - 8
                    }
                  ]}
                />
              )}
              
              {/* Truck Icon */}
              <View
                style={[
                  styles.truckMarker,
                  {
                    left: mapToViewCoords(truckPosition, mapWidth, mapHeight).x - 12,
                    top: mapToViewCoords(truckPosition, mapWidth, mapHeight).y - 12
                  }
                ]}
              >
                <FontAwesome5 name="truck" size={16} color="#FFFFFF" />
              </View>
              
              {/* City Labels */}
              {routePath.length > 0 && (
                <ThemedText 
                  style={[
                    styles.cityLabel,
                    {
                      left: mapToViewCoords(routePath[0], mapWidth, mapHeight).x - 30,
                      top: mapToViewCoords(routePath[0], mapWidth, mapHeight).y - 25
                    }
                  ]}
                >
                  {order.origin}
                </ThemedText>
              )}
              
              {routePath.length > 1 && (
                <ThemedText 
                  style={[
                    styles.cityLabel,
                    {
                      left: mapToViewCoords(routePath[routePath.length - 1], mapWidth, mapHeight).x - 30,
                      top: mapToViewCoords(routePath[routePath.length - 1], mapWidth, mapHeight).y - 25
                    }
                  ]}
                >
                  {order.destination}
                </ThemedText>
              )}
            </View>
            
            <View style={styles.mapLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.originDot]} />
                <ThemedText style={styles.legendText}>{t('origin')}</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.destinationDot]} />
                <ThemedText style={styles.legendText}>{t('destination')}</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendDot}>
                  <FontAwesome5 name="truck" size={8} color="#FFFFFF" />
                </View>
                <ThemedText style={styles.legendText}>{t('currentLocation')}</ThemedText>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Tracking Status Card */}
        <Card title={t('deliveryStatus')}>
          <View style={styles.statusContainer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${progress}%` }]} />
              </View>
              <View style={styles.progressLabels}>
                <ThemedText style={styles.progressLabel}>{order.origin}</ThemedText>
                <ThemedText style={styles.progressLabel}>{order.destination}</ThemedText>
              </View>
            </View>
            
            <View style={styles.statusInfo}>
              <View style={styles.statusItem}>
                <FontAwesome5 name="shipping-fast" size={18} color="#35B468" />
                <View style={styles.statusTextContainer}>
                  <ThemedText style={styles.statusTitle}>{t('inProgress')}</ThemedText>
                  <ThemedText style={styles.statusText}>
                    {order.vehicleType} {t('inTransit')}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.statusItem}>
                <MaterialIcons name="access-time" size={18} color="#35B468" />
                <View style={styles.statusTextContainer}>
                  <ThemedText style={styles.statusTitle}>{t('eta')}:</ThemedText>
                  <ThemedText style={styles.statusText}>
                    {getEstimatedTimeRemaining()} {t('min')}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.statusItem}>
                <FontAwesome5 name="map-marker-alt" size={18} color="#35B468" />
                <View style={styles.statusTextContainer}>
                  <ThemedText style={styles.statusTitle}>{t('currentLocation')}:</ThemedText>
                  <ThemedText style={styles.statusText}>
                    {progress < 20 ? t('nearOrigin') : 
                     progress > 80 ? t('nearDestination') : 
                     t('enRoute')}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </Card>
        
        {/* Driver Info Card */}
        <Card title={t('driverInfo')}>
          <View style={styles.driverContainer}>
            <View style={styles.driverIcon}>
              <FontAwesome5 name="user-tie" size={24} color="#35B468" />
            </View>
            <View style={styles.driverInfo}>
              <ThemedText style={styles.driverName}>{order.driverName}</ThemedText>
              <ThemedText style={styles.driverVehicle}>{order.vehicleType}</ThemedText>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <MaterialIcons name="phone" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* Order Details Card */}
        <Card title={t('orderDetails')}>
          <View style={styles.orderDetailsContainer}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('orderId')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.orderId}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('customer')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.customer}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('product')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.productType}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('weight')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.weight}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('date')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.date}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{t('eta')}:</ThemedText>
              <ThemedText style={styles.detailValue}>{order.estimatedArrival}</ThemedText>
            </View>
          </View>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#35B468',
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
  placeholder: {
    width: 40,
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  // Map styles
  mapContainer: {
    marginVertical: 10,
  },
  map: {
    height: 220,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  routePath: {
    height: 3,
    backgroundColor: '#35B468',
    position: 'absolute',
    transformOrigin: 'left',
  },
  locationMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  originMarker: {
    backgroundColor: '#35B468',
  },
  destinationMarker: {
    backgroundColor: '#FF5252',
  },
  truckMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#35B468',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  cityLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '500',
    color: '#282828',
    width: 60,
    textAlign: 'center',
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#35B468',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  originDot: {
    backgroundColor: '#35B468',
  },
  destinationDot: {
    backgroundColor: '#FF5252',
  },
  legendText: {
    fontSize: 10,
    color: '#777777',
  },
  // Status tracking styles
  statusContainer: {
    marginBottom: 10,
  },
  progressContainer: {
    marginVertical: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#35B468',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#777777',
    maxWidth: '45%',
  },
  statusInfo: {
    marginTop: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTextContainer: {
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
  },
  statusText: {
    fontSize: 13,
    color: '#777777',
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  driverIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282828',
    marginBottom: 4,
  },
  driverVehicle: {
    fontSize: 14,
    color: '#777777',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#35B468',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderDetailsContainer: {
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: '#777777',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#282828',
  },
});
