import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Modal, StatusBar, Platform, ActivityIndicator, Alert, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { tabStyles } from '@/assets/styles/tabStyles';
import { useTranslation } from '@/translations/useTranslation';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/tabs/Card';
import { GOOGLE_MAPS_API_KEY, GOOGLE_JAVA_SCR_API_KEY } from '@/constants/API_KEYS';
import { WebView } from 'react-native-webview';

// Import our API services
import orderService from '@/api/orderService';
import trackingService, { GeoLocation } from '@/api/trackingService';

// Types for order data from the API
type Order = {
  id: string | number; // Accept both string and number to handle different API formats
  status: string;
  source_city: string;
  destination_city: string;
  sender_name: string;
  recipient_name: string;
  order_date: string;
  estimated_delivery_date: string;
  delivery_fee: number;
  weight: number;
  cargo_type: string;
  origin?: GeoLocation;
  destination?: GeoLocation;
};

// Types for Google Directions API responses
type DirectionsStep = {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_location: { lat: number; lng: number };
  end_location: { lat: number; lng: number };
  html_instructions: string;
  travel_mode: string;
  maneuver?: string;
};

type DirectionsLeg = {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_address: string;
  end_address: string;
  start_location: { lat: number; lng: number };
  end_location: { lat: number; lng: number };
  steps: DirectionsStep[];
};

type DirectionsRoute = {
  legs: DirectionsLeg[];
  overview_polyline: { points: string };
  summary: string;
  warnings: string[];
  bounds: { northeast: { lat: number; lng: number }; southwest: { lat: number; lng: number } };
};

type DirectionsResponse = {
  status: string;
  routes: DirectionsRoute[];
};

// Get coordinates for a city name through the API
const getCityGeoCoordinates = async (cityName: string): Promise<GeoLocation> => {
  return trackingService.getCityCoordinates(cityName);
};

// Calculate a position between two points based on progress (0-100%)
const calculatePositionBetween = (start: GeoLocation, end: GeoLocation, progress: number): GeoLocation => {
  const normalizedProgress = progress / 100;

  return {
    latitude: start.latitude + (end.latitude - start.latitude) * normalizedProgress,
    longitude: start.longitude + (end.longitude - start.longitude) * normalizedProgress,
    title: 'Truck Location', // Added a title for the truck location
  };
};

// Fetch detailed route steps from Google Directions API
const getDetailedRouteSteps = async (originCoords: GeoLocation, destCoords: GeoLocation): Promise<DirectionsStep[] | null> => {
  try {
    // Add mode=driving to ensure we get driving directions
    // Add alternatives=true to get alternative routes if available
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoords.latitude},${originCoords.longitude}&destination=${destCoords.latitude},${destCoords.longitude}&mode=driving&alternatives=true&key=${GOOGLE_JAVA_SCR_API_KEY}`;
    
    console.log(`Fetching route data between (${originCoords.latitude}, ${originCoords.longitude}) and (${destCoords.latitude}, ${destCoords.longitude})`);
    
    const response = await fetch(url);
    const json = await response.json() as DirectionsResponse;
    
    console.log(`Directions API response status: ${json.status}`);
    
    if (json.status === 'OK' && json.routes.length > 0) {
      // Verify we have legs and steps
      if (json.routes[0].legs && json.routes[0].legs.length > 0) {
        const steps = json.routes[0].legs[0].steps;
        if (steps && steps.length > 0) {
          console.log(`Successfully retrieved ${steps.length} route steps`);
          return steps;
        } else {
          console.warn('No route steps returned from Directions API, falling back to straight line');
        }
      } else {
        console.warn('No route legs returned from Directions API, falling back to straight line');
      }
    } else {
      // Log the specific error from the API
      console.warn(`Directions API returned status: ${json.status}. Error message: ${json.status === 'ZERO_RESULTS' ? 'No route exists between these points' : 'Unknown error'}`);
    }
    
    // If we get here, create a fallback with manual waypoints
    return createFallbackRouteSteps(originCoords, destCoords);
  } catch (error) {
    console.error('Error fetching route data:', error);
    return createFallbackRouteSteps(originCoords, destCoords);
  }
};

// Create fallback route steps when the API fails
const createFallbackRouteSteps = (origin: GeoLocation, destination: GeoLocation): DirectionsStep[] => {
  // Calculate the midpoint for a simple waypoint
  const midpoint = {
    lat: origin.latitude + (destination.latitude - origin.latitude) / 2,
    lng: origin.longitude + (destination.longitude - origin.longitude) / 2
  };
  
  // Calculate total distance (in meters) using Haversine formula
  const totalDistance = calculateDistance(
    origin.latitude, origin.longitude,
    destination.latitude, destination.longitude
  );
  
  // Split the distance for our two segments
  const halfDistance = totalDistance / 2;
  
  // Create a simple 2-step route
  return [
    {
      distance: { text: `${Math.round(halfDistance / 1000)} km`, value: halfDistance },
      duration: { text: '0 mins', value: 0 },
      start_location: { lat: origin.latitude, lng: origin.longitude },
      end_location: { lat: midpoint.lat, lng: midpoint.lng },
      html_instructions: 'Head to midpoint',
      travel_mode: 'DRIVING'
    },
    {
      distance: { text: `${Math.round(halfDistance / 1000)} km`, value: halfDistance },
      duration: { text: '0 mins', value: 0 },
      start_location: { lat: midpoint.lat, lng: midpoint.lng },
      end_location: { lat: destination.latitude, lng: destination.longitude },
      html_instructions: 'Continue to destination',
      travel_mode: 'DRIVING'
    }
  ];
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Calculate truck position along the actual route based on progress percentage
const calculateTruckPositionOnRoute = (routeSteps: DirectionsStep[], progress: number): GeoLocation | null => {
  if (!routeSteps || routeSteps.length === 0) {
    return null;
  }

  // Calculate total route distance
  const totalDistance = routeSteps.reduce(
    (sum, step) => sum + step.distance.value, 0
  );
  
  // Calculate how far along the route we should be based on progress
  const targetDistance = (progress / 100) * totalDistance;
  
  let cumulativeDistance = 0;
  
  // Find the step where the truck should be
  for (let i = 0; i < routeSteps.length; i++) {
    const step = routeSteps[i];
    const stepDistance = step.distance.value;
    
    if (cumulativeDistance + stepDistance >= targetDistance) {
      // How far along this step (0-1)
      const stepProgress = (targetDistance - cumulativeDistance) / stepDistance;
      
      // Get start and end points of this step
      const startLat = step.start_location.lat;
      const startLng = step.start_location.lng;
      const endLat = step.end_location.lat;
      const endLng = step.end_location.lng;
      
      // Interpolate position along this step
      return {
        latitude: startLat + (endLat - startLat) * stepProgress,
        longitude: startLng + (endLng - startLng) * stepProgress,
        title: 'Truck Location'
      };
    }
    
    cumulativeDistance += stepDistance;
  }
  
  // If we got here, return the last point
  const lastStep = routeSteps[routeSteps.length - 1];
  return {
    latitude: lastStep.end_location.lat,
    longitude: lastStep.end_location.lng,
    title: 'Truck Location'
  };
};

// Get delivery progress from the API
const getDeliveryProgress = async (orderId: number): Promise<number> => {
  try {
    // Fetch the tracking data from the API
    const trackingData = await trackingService.getOrderTracking(orderId);
    return trackingData.progress_percentage;
  } catch (error) {
    console.error('Error fetching delivery progress:', error);
    // Return 0 as fallback
    return 0;
  }
};

function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  
  // State variables for order data and tracking
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapHtml, setMapHtml] = useState<string>('');
  const [showMap, setShowMap] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [origin, setOrigin] = useState<GeoLocation | null>(null);
  const [destination, setDestination] = useState<GeoLocation | null>(null);
  const [truckPosition, setTruckPosition] = useState<GeoLocation | null>(null);
  const [routeSteps, setRouteSteps] = useState<DirectionsStep[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  const handleGoBack = () => {
    router.back();
  };

  // Fetch order data and setup tracking
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Parse and validate the order ID
        let orderId;
        if (typeof id === 'string') {
          orderId = parseInt(id, 10);
        } else if (Array.isArray(id)) {
          orderId = parseInt(id[0], 10);
        } else {
          orderId = typeof id === 'number' ? id : 0;
        }
        
        // Check if orderId is valid
        if (isNaN(orderId) || orderId <= 0) {
          setError('Invalid order ID');
          setLoading(false);
          return;
        }
        
        // Fetch order from API - API expects string ID
        const orderData = await orderService.getOrderById(String(orderId));

        if (!orderData) {
          setError('Order not found');
          router.back();
          return;
        }
        
        // Map API response to Order type
        const orderWithCoords: Order = {
          id: orderData.id,
          status: typeof orderData.status === 'number' ? String(orderData.status) : orderData.status,
          source_city: orderData.origin?.name || '',
          destination_city: orderData.destination?.name || '',
          sender_name: (orderData as any).sender_name || '',
          recipient_name: (orderData as any).recipient_name || '',
          order_date: (orderData as any).created_at || '',
          estimated_delivery_date: (orderData as any).delivery_date || '',
          delivery_fee: (orderData as any).delivery_fee ? Number((orderData as any).delivery_fee) : 0,
          weight: orderData.weight ? Number(orderData.weight) : 0,
          cargo_type: (orderData as any).cargo_type || '',
          origin: orderData.origin,
          destination: orderData.destination
        };
        
        setOrder(orderWithCoords);
        
        // Declare this as a variable we can use in this scope
        const placeholderOrder = orderWithCoords;
        
        // Get the progress value from the API
        const progress = await getDeliveryProgress(orderId);
        setProgressValue(progress);
        
        // Use origin and destination from the mapped order data
        if (placeholderOrder.origin) {
          setOrigin({
            latitude: placeholderOrder.origin.latitude,
            longitude: placeholderOrder.origin.longitude,
            title: placeholderOrder.source_city
          });
        }
        
        if (placeholderOrder.destination) {
          setDestination({
            latitude: placeholderOrder.destination.latitude,
            longitude: placeholderOrder.destination.longitude,
            title: placeholderOrder.destination_city
          });
        }
        
        // Local function to get route steps (since trackingService doesn't have this method)
        const getRouteSteps = async (origin: GeoLocation, destination: GeoLocation): Promise<DirectionsStep[]> => {
          try {
            // Would normally call an API here, but for now returning empty array
            // This would be implemented to use Google Directions API or a similar service
            console.log('Getting route steps from', origin, 'to', destination);
            return [];
          } catch (error) {
            console.error('Error getting route steps:', error);
            return [];
          }
        };
        
        // Get route steps from Google Directions API
        if (placeholderOrder.origin && placeholderOrder.destination) {
          const steps = await getRouteSteps(
            {
              latitude: placeholderOrder.origin.latitude,
              longitude: placeholderOrder.origin.longitude
            },
            {
              latitude: placeholderOrder.destination.latitude,
              longitude: placeholderOrder.destination.longitude
            }
          );
          setRouteSteps(steps);
        }
        
        // Local functions for truck position calculation
        const calculateTruckPositionOnRoute = (steps: DirectionsStep[], progress: number): GeoLocation | null => {
          if (!steps || steps.length === 0) return null;
          
          // Simple implementation - this would normally have more complex logic
          // to determine position along the route based on progress
          const startPoint = steps[0].start_location;
          const endPoint = steps[steps.length - 1].end_location;
          
          return {
            latitude: startPoint.lat + (endPoint.lat - startPoint.lat) * progress,
            longitude: startPoint.lng + (endPoint.lng - startPoint.lng) * progress
          };
        };
        
        const calculatePositionBetween = (start: GeoLocation, end: GeoLocation, progress: number): GeoLocation => {
          return {
            latitude: start.latitude + (end.latitude - start.latitude) * progress,
            longitude: start.longitude + (end.longitude - start.longitude) * progress
          };
        };
        
        // Calculate the truck's position based on the route and progress
        if (routeSteps && placeholderOrder.origin && placeholderOrder.destination) {
          const truckPos = calculateTruckPositionOnRoute(routeSteps, progressValue / 100);
          if (truckPos) {
            setTruckPosition(truckPos);
          } else {
            // Fallback to simple interpolation if route-based positioning fails
            const pos = calculatePositionBetween(
              { latitude: placeholderOrder.origin.latitude, longitude: placeholderOrder.origin.longitude },
              { latitude: placeholderOrder.destination.latitude, longitude: placeholderOrder.destination.longitude },
              progressValue / 100
            );
            setTruckPosition(pos);
          }
        } else if (placeholderOrder.origin && placeholderOrder.destination) {
          // Use simple interpolation if no route steps
          const pos = calculatePositionBetween(
            { latitude: placeholderOrder.origin.latitude, longitude: placeholderOrder.origin.longitude },
            { latitude: placeholderOrder.destination.latitude, longitude: placeholderOrder.destination.longitude },
            progressValue / 100
          );
          setTruckPosition(pos);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
        setError('Error loading order data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, router]);

  // Set up periodic updates for truck position to simulate movement
  useEffect(() => {
    if (origin && destination && routeSteps && routeSteps.length > 0) {
      // Clear any existing interval
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      
      // Create new interval for periodic updates
      const interval = setInterval(() => {
        setProgressValue(prevProgress => {
          // Increment progress slightly to simulate movement (max 100%)
          const newProgress = Math.min(prevProgress + 0.5, 100);
          
          // Update truck position with new progress
          if (routeSteps) {
            const newTruckPos = calculateTruckPositionOnRoute(routeSteps, newProgress / 100);
            if (newTruckPos) {
              setTruckPosition(newTruckPos);
            }
          }
          
          return newProgress;
        });
      }, 10000); // Update every 10 seconds
      
      setUpdateInterval(interval as unknown as NodeJS.Timeout);
    }
    
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [origin, destination, routeSteps]);

  if (loading) {
    return (
      <ThemedView style={tabStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('loading')}</ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#35B468" />
          <ThemedText style={styles.loadingText}>{t('loadingOrderData')}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!order || !origin || !destination || !truckPosition) {
    return (
      <ThemedView style={tabStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('error')}</ThemedText>
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#ff6b6b" />
          <ThemedText style={styles.errorText}>{t('orderNotFound')}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <ThemedView style={tabStyles.container}>
      <StatusBar backgroundColor="#35B468" barStyle="light-content" />
      <View style={styles.fullscreenHeader}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.closeButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.fullscreenTitle}>{t('liveTracking')}</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {origin && destination && truckPosition ? (
        <View style={styles.fullscreenMapView}>
          <WebView
            style={{flex: 1}}
            originWhitelist={['*']}
            onError={(error) => console.error('WebView error:', error)}
            onHttpError={(error) => console.error('WebView HTTP error:', error)}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={[styles.fullscreenMapView, styles.loadingContainer]}>
                <ThemedText style={styles.loadingText}>Loading map...</ThemedText>
              </View>
            )}
            source={{
              html: `<!DOCTYPE html>
                    <html>
                    <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    <style>
                      body { margin: 0; padding: 0; }
                      #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%; }
                      #error { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                              background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 8px; text-align: center; }
                      #legend { position: absolute; bottom: 20px; right: 20px; background-color: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
                      .legend-item { display: flex; align-items: center; margin: 24px 0; }
                      .legend-color { width: 15px; height: 15px; border-radius: 50%; margin-right: 8px; }
                    </style>
                  </head>
                  <body>
                    <div id="map"></div>
                    <div id="error">Unable to load the map. Please try again.</div>
                    
                    <script>
                      // Error handling for the Google Maps API
                      window.onerror = function(message, source, lineno, colno, error) {
                        console.error('JavaScript error:', message);
                        document.getElementById('map').style.display = 'none';
                        document.getElementById('error').style.display = 'block';
                        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: message}));
                        return true;
                      };
                      
                      // Initialize variables
                      let map;
                      let originMarker;
                      let destMarker;
                      let truckMarker;
                      let directionsRenderer;
                      let trafficLayer;
                      let infoWindow;
                      
                      // Load Google Maps API
                      function loadGoogleMapsScript() {
                        const script = document.createElement('script');
                        script.src = 'https://maps.googleapis.com/maps/api/js?key=${GOOGLE_JAVA_SCR_API_KEY}&callback=initMap';
                        script.async = true;
                        script.defer = true;
                        script.onerror = function() {
                          document.getElementById('map').style.display = 'none';
                          document.getElementById('error').style.display = 'block';
                          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: 'Failed to load Google Maps API'}));
                        };
                        document.head.appendChild(script);
                      }

                      // Initialize map when Google Maps API is loaded
                      function initMap() {
                        try {
                          const originLocation = { lat: ${origin.latitude}, lng: ${origin.longitude} };
                          const destLocation = { lat: ${destination.latitude}, lng: ${destination.longitude} };
                          const truckLocation = { lat: ${truckPosition.latitude}, lng: ${truckPosition.longitude} };

                          map = new google.maps.Map(document.getElementById('map'), {
                            center: truckLocation,
                            zoom: 7,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            mapTypeControl: true,
                            mapTypeControlOptions: {
                              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                              position: google.maps.ControlPosition.TOP_RIGHT
                            }
                          });

                          // Fit map to show all markers
                          const bounds = new google.maps.LatLngBounds();
                          bounds.extend(originLocation);
                          bounds.extend(destLocation);
                          bounds.extend(truckLocation);
                          map.fitBounds(bounds);

                          // Create markers for origin, destination and truck
                          createMarkers(originLocation, destLocation, truckLocation);
                          
                          // Add traffic layer (with error handling)
                          try {
                            trafficLayer = new google.maps.TrafficLayer();
                            trafficLayer.setMap(map);
                          } catch (e) {
                            console.error('Traffic layer error:', e);
                          }
                          
                          // Draw route with directions API (with error handling)
                          try {
                            drawRoute(originLocation, destLocation);
                          } catch (e) {
                            console.error('Route drawing error:', e);
                            // Fall back to drawing a simple polyline
                            drawSimpleLine(originLocation, destLocation, truckLocation);
                          }
                          
                          // Add a legend
                          addLegend();
                          
                          // Notify React Native that map is ready
                          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'mapReady'}));
                        } catch (e) {
                          console.error('Map initialization error:', e);
                          document.getElementById('map').style.display = 'none';
                          document.getElementById('error').style.display = 'block';
                          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: e.message}));
                        }
                      }

                      // Add a legend to explain the markers
                      function addLegend() {
                        const legend = document.createElement('div');
                        legend.id = 'legend';
                        
                        const content = [
                          { color: '#35B468', label: 'Origin (A)' },
                          { color: '#FF5252', label: 'Destination (B)' },
                          { color: '#3498db', label: 'Truck Location' }
                        ];
                        
                        content.forEach(item => {
                          const div = document.createElement('div');
                          div.className = 'legend-item';
                          
                          const colorBox = document.createElement('div');
                          colorBox.className = 'legend-color';
                          colorBox.style.backgroundColor = item.color;
                          div.appendChild(colorBox);
                          
                          const text = document.createElement('span');
                          text.textContent = item.label;
                          div.appendChild(text);
                          
                          legend.appendChild(div);
                        });
                        
                        map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(legend);
                      }

                      // Create markers for all locations
                      function createMarkers(originLocation, destLocation, truckLocation) {
                        // Create info window shared by all markers
                        infoWindow = new google.maps.InfoWindow();
                        
                        // Origin marker (A)
                        originMarker = new google.maps.Marker({
                          position: originLocation,
                          map: map,
                          icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#35B468',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2,
                            scale: 8
                          },
                          label: { text: 'A', color: '#FFFFFF', fontSize: '12px', fontWeight: 'bold' },
                          title: '${order?.origin || "Origin"}'
                        });

                        // Origin marker click handler
                        originMarker.addListener('click', function() {
                          infoWindow.setContent('<div><strong>' + '${order?.origin || "Origin"}' + '</strong><br>Starting point of delivery</div>');
                          infoWindow.open(map, originMarker);
                        });

                        // Destination marker (B)
                        destMarker = new google.maps.Marker({
                          position: destLocation,
                          map: map,
                          icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#FF5252',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2,
                            scale: 8
                          },
                          label: { text: 'B', color: '#FFFFFF', fontSize: '12px', fontWeight: 'bold' },
                          title: '${order?.destination || "Destination"}'
                        });

                        // Destination marker click handler
                        destMarker.addListener('click', function() {
                          infoWindow.setContent('<div><strong>' + '${order?.destination || "Destination"}' + '</strong><br>Delivery destination</div>');
                          infoWindow.open(map, destMarker);
                        });

                        // Truck marker
                        truckMarker = new google.maps.Marker({
                          position: truckLocation,
                          map: map,
                          icon: {
                            path: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5l1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
                            fillColor: '#3498db',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 1,
                            scale: 1.2,
                            anchor: new google.maps.Point(12, 12)
                          },
                          title: 'Current Truck Location',
                          zIndex: 10 // Keep truck on top
                        });

                        // Truck marker click handler
                        truckMarker.addListener('click', function() {
                          const progressPercent = ${progressValue};
                          let status = '';
                          if (progressPercent < 20) status = 'Just departed';
                          else if (progressPercent > 80) status = 'Approaching destination';
                          else status = 'En route';
                          
                          infoWindow.setContent('<div><strong>Delivery Truck</strong><br>Status: ' + status + '<br>Progress: ' + Math.round(progressPercent) + '%</div>');
                          infoWindow.open(map, truckMarker);
                        });
                      }

                      // Draw route between origin and destination
                      function drawRoute(originLocation, destLocation) {
                        // Set up the Directions Service
                        const directionsService = new google.maps.DirectionsService();
                        directionsRenderer = new google.maps.DirectionsRenderer({
                          map: map,
                          suppressMarkers: true,
                          polylineOptions: {
                            strokeColor: '#35B468',
                            strokeWeight: 4
                          }
                        });

                        // Request the route
                        directionsService.route({
                          origin: originLocation,
                          destination: destLocation,
                          travelMode: google.maps.TravelMode.DRIVING,
                          provideRouteAlternatives: true,
                          optimizeWaypoints: true
                        }, (response, status) => {
                          if (status === 'OK') {
                            directionsRenderer.setDirections(response);
                            const progressBarValue = ${progressValue};
                            const progressContainer = document.createElement('div');
                            progressContainer.className = 'progress-container';
                            const progressBar = document.createElement('div');
                            progressBar.className = 'progress-bar';
                            const progressFill = document.createElement('div');
                            progressFill.className = 'progress-fill';
                            progressFill.style.width = progressValue + '%';
                            progressBar.appendChild(progressFill);
                            progressContainer.appendChild(progressBar);
                            document.getElementById('map').appendChild(progressContainer);
                          } else {
                            // Fall back to a simple line if directions service fails
                            console.error('Directions request failed due to ' + status);
                            drawSimpleLine(originLocation, destLocation);
                          }
                        });
                      }

                      // Fallback function to draw a simple line between points
                      function drawSimpleLine(originLocation, destLocation, truckLocation) {
                        const path = [originLocation];
                        if (truckLocation) path.push(truckLocation);
                        path.push(destLocation);
                        
                        new google.maps.Polyline({
                          path: path,
                          geodesic: true,
                          strokeColor: '#35B468',
                          strokeOpacity: 0.8,
                          strokeWeight: 4,
                          map: map
                        });
                      }
                      
                      // Start loading Google Maps
                      loadGoogleMapsScript();
                    </script>
                  </body>
                  </html>
                `
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onMessage={(event) => {
                try {
                  const message = JSON.parse(event.nativeEvent.data);
                  if (message.type === 'error') {
                    console.error('Map error:', message);
                  }
                } catch (e) {
                  console.error('Error parsing WebView message:', e);
                }
              }
            }
            />
          </View>
        ) : (
          <View style={[styles.fullscreenMapView, styles.loadingContainer]}>
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
    </ThemedView>
  );
}

// Style configurations
const styles = StyleSheet.create({
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  addressText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  verticalLine: {
    height: 30,
    width: 2,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
    marginLeft: 10,
    alignItems: 'center',
  },
  dotIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#35B468',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#35B468',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // ... (rest of the code remains the same)
  backButtonContainer: {
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
      marginTop: 16,
      fontSize: 16,
      color: '#ffffff',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    errorText: {
      marginTop: 16,
      fontSize: 16,
      textAlign: 'center',
      color: '#ffffff',
      marginBottom: 24,
    },
    errorButton: {
      backgroundColor: '#ffffff',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    errorButtonText: {
      color: '#35B468',
      fontWeight: '600',
      fontSize: 16,
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
      height: 300,
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden',
    },
    fullscreenIndicator: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 20,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    fullscreenText: {
      fontSize: 10,
      marginLeft: 5,
      color: '#282828',
    },
    mapImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    mapOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      paddingVertical: 5,
    },
    originMarker: {
      backgroundColor: '#35B468',
    },
    destinationMarker: {
      backgroundColor: '#FF5252',
    },
    mapLegend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 5,
    },
    fullscreenContainer: {
      flex: 1,
      backgroundColor: '#FBFBFB',
    },
    fullscreenHeader: {
      paddingTop: Platform.OS === 'ios' ? 50 : 40,
      paddingHorizontal: 20,
      paddingBottom: 15,
      backgroundColor: '#35B468',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 10,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullscreenTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FBFBFB',
      fontFamily: 'Comfortaa',
    },
    fullscreenMapView: {
      flex: 1,
      width: '100%',
      height: '100%',
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
    },
  });

export default OrderTrackingScreen;
