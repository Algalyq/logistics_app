// import { ThemedText } from '@/components/ThemedText';
// import { useTranslation } from '@/translations/useTranslation';
// import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import React, { useState, useRef, useEffect } from 'react';
// import { Modal, SafeAreaView, StyleSheet, TouchableOpacity, View, ActivityIndicator, Dimensions, Platform } from 'react-native';
// import MapView, { Marker, Polyline, PROVIDER_DEFAULT, Region } from 'react-native-maps';

// interface Location {
//   latitude: number;
//   longitude: number;
//   name?: string;
//   address?: string;
// }

// interface FullScreenMapModalProps {
//   visible: boolean;
//   onClose: () => void;
//   origin: Location;
//   destination: Location;
//   status: string;
// }

// const FullScreenMapModal = ({ visible, onClose, origin, destination, status }: FullScreenMapModalProps) => {
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(true);
//   const mapRef = useRef<MapView>(null);
  
//   // Generate route points (in a real app, you would use a directions API)
//   const routeCoordinates = [];
//   for (let i = 0; i <= 20; i++) {
//     routeCoordinates.push({
//       latitude: origin.latitude + (destination.latitude - origin.latitude) * (i / 20),
//       longitude: origin.longitude + (destination.longitude - origin.longitude) * (i / 20),
//     });
//   }
  
//   // Calculate the center point and deltas for the map region
//   const latDelta = Math.abs(origin.latitude - destination.latitude) * 1.5 + 0.01;
//   const lngDelta = Math.abs(origin.longitude - destination.longitude) * 1.5 + 0.01;
  
//   const initialRegion: Region = {
//     latitude: (origin.latitude + destination.latitude) / 2,
//     longitude: (origin.longitude + destination.longitude) / 2,
//     latitudeDelta: latDelta,
//     longitudeDelta: lngDelta,
//   };
  
//   // Get truck position based on order status
//   let truckPosition;
//   if (status === 'in-progress') {
//     // Truck is on the way (halfway)
//     truckPosition = {
//       latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.5,
//       longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.5,
//     };
//   } else if (status === 'completed') {
//     // Truck at destination
//     truckPosition = {
//       latitude: destination.latitude,
//       longitude: destination.longitude,
//     };
//   } else {
//     // Truck at origin
//     truckPosition = {
//       latitude: origin.latitude,
//       longitude: origin.longitude,
//     };
//   }
  
//   // When the map is ready, fit it to show both markers
//   const onMapReady = () => {
//     setLoading(false);
    
//     // Make sure we have valid coordinates before fitting to markers
//     if (origin && destination && mapRef.current) {
//       mapRef.current.fitToCoordinates(
//         [origin, destination],
//         {
//           edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//           animated: true,
//         }
//       );
//     }
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={false}
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <MaterialIcons name="arrow-back" size={24} color="#35B468" />
//           </TouchableOpacity>
//           <ThemedText style={styles.title}>{t('liveTracking')}</ThemedText>
//           <View style={styles.placeholder} />
//         </View>
        
//         <View style={styles.mapContainer}>
//           {/* Interactive Map View */}
//           <MapView
//             ref={mapRef}
//             style={styles.map}
//             provider={PROVIDER_DEFAULT}
//             initialRegion={initialRegion}
//             onMapReady={onMapReady}
//             showsUserLocation={false}
//             showsMyLocationButton={false}
//             showsCompass={true}
//             zoomEnabled={true}
//             rotateEnabled={true}
//             scrollEnabled={true}
//             pitchEnabled={true}
//           >
//             {/* Origin Marker */}
//             <Marker
//               coordinate={origin}
//               title={origin.name || t('origin')}
//               description={origin.address || ''}
//               pinColor="green"
//             />

//             {/* Destination Marker */}
//             <Marker
//               coordinate={destination}
//               title={destination.name || t('destination')}
//               description={destination.address || ''}
//               pinColor="red"
//             />

//             {/* Truck Marker */}
//             <Marker
//               coordinate={truckPosition}
//               title={t('delivery')}
//               description={t('estimatedArrival')}
//             >
//               <View style={styles.truckIconContainer}>
//                 <MaterialIcons name="local-shipping" size={24} color="white" />
//               </View>
//             </Marker>

//             {/* Route Polyline */}
//             <Polyline
//               coordinates={routeCoordinates}
//               strokeWidth={4}
//               strokeColor="#35B468"
//               lineDashPattern={[1]}
//             />
//           </MapView>
          
//           {/* Loading Indicator */}
//           {loading && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#35B468" />
//               <ThemedText style={styles.loadingText}>{t('loading')}</ThemedText>
//             </View>
//           )}
          
//           {/* Map Controls */}
//           <View style={styles.mapLegend}>
//             <TouchableOpacity 
//               style={styles.legendItem}
//               onPress={() => mapRef.current?.fitToCoordinates(
//                 [origin, destination],
//                 { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
//               )}
//             >
//               <View style={[styles.legendIcon, { backgroundColor: '#35B468' }]} />
//               <ThemedText style={styles.legendText}>{t('refreshMap')}</ThemedText>
//             </TouchableOpacity>
//           </View>
//         </View>
        
//         {/* Status Information */}
//         <View style={styles.statusContainer}>
//           <ThemedText style={styles.statusText}>
//             {status === 'in-progress' ? t('estimatedArrival') : 
//              status === 'completed' ? t('deliveryCompleted') : 
//              t('waitingForDriver')}
//           </ThemedText>
//         </View>

//         <View style={styles.footer}>
//           <View style={styles.infoItem}>
//             <MaterialIcons name="location-on" size={20} color="#22AA44" />
//             <ThemedText style={styles.infoText}>{origin.name || t('origin')}</ThemedText>
//           </View>
          
//           <View style={styles.infoItem}>
//             <MaterialIcons name="arrow-right-alt" size={20} color="#555" />
//           </View>
          
//           <View style={styles.infoItem}>
//             <MaterialIcons name="location-on" size={20} color="#AA2222" />
//             <ThemedText style={styles.infoText}>{destination.name || t('destination')}</ThemedText>
//           </View>
//         </View>
//       </SafeAreaView>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FBFBFB',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     height: 56,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEEEE',
//   },
//   closeButton: {
//     padding: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontFamily: 'Comfortaa-SemiBold',
//     color: '#282828',
//   },
//   placeholder: {
//     width: 40,
//   },
//   mapContainer: {
//     flex: 1,
//     position: 'relative',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     zIndex: 1,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: '#555',
//     fontFamily: 'Comfortaa-Medium',
//   },
//   mapImage: {
//     width: '100%',
//     height: '100%',
//   },
//   mapLegend: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 8,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 4,
//   },
//   legendIcon: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#333',
//   },
//   mapPlaceholder: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//     padding: 20,
//     justifyContent: 'space-between',
//   },
//   markerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   originMarker: {
//     backgroundColor: 'rgba(34, 170, 68, 0.1)',
//   },
//   destMarker: {
//     backgroundColor: 'rgba(170, 34, 34, 0.1)',
//   },
//   markerLabel: {
//     marginLeft: 10,
//     fontSize: 16,
//     flex: 1,
//   },
//   routeContainer: {
//     position: 'relative',
//     height: 100,
//     justifyContent: 'center',
//     marginVertical: 20,
//   },
//   routeLine: {
//     height: 8,
//     backgroundColor: '#ddd',
//     borderRadius: 4,
//     width: '100%',
//   },
//   truckContainer: {
//     position: 'absolute',
//     top: '50%',
//     marginTop: -20,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#35B468',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'white',
//     transform: [{ translateX: -20 }],
//   },
//   statusContainer: {
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: 'rgba(53, 180, 104, 0.1)',
//     borderRadius: 0,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//   },
//   statusText: {
//     fontSize: 16,
//     color: '#35B468',
//     fontFamily: 'Comfortaa-Medium',
//   },
//   // Keep this for backward compatibility
//   truckIconContainer: {
//     backgroundColor: '#35B468',
//     borderRadius: 20,
//     padding: 8,
//     borderWidth: 2,
//     borderColor: 'white',
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   infoText: {
//     marginLeft: 8,
//     fontSize: 14,
//     color: '#333',
//   },
// });

// export default FullScreenMapModal;
