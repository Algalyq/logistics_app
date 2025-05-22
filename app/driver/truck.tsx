// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { api } from '../../services/api';

// interface Truck {
//   id: number;
//   make: string;
//   model: string;
//   year: number;
//   license_plate: string;
//   truck_type: string;
//   max_load: number;
//   is_active: boolean;
//   registration_document: string;
//   insurance_document: string;
//   inspection_document: string;
//   registration_expiry: string;
//   insurance_expiry: string;
//   inspection_expiry: string;
// }

// export default function TruckInfo() {
//   const [truck, setTruck] = useState<Truck | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState<string | null>(null);

//   useEffect(() => {
//     fetchTruckInfo();
//   }, []);

//   const fetchTruckInfo = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/api/trucks/my-truck/');
//       setTruck(response.data);
//     } catch (error) {
//       console.error('Error fetching truck info:', error);
//       if (error.response?.status === 404) {
//         // No truck assigned yet
//         setTruck(null);
//       } else {
//         Alert.alert('Error', 'Failed to load truck information');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pickImage = async (field: string) => {
//     try {
//       setUploading(field);
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         await uploadImage(result.assets[0].uri, field);
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//       Alert.alert('Error', 'Failed to select image');
//     } finally {
//       setUploading(null);
//     }
//   };

//   const uploadImage = async (uri: string, field: string) => {
//     try {
//       const formData = new FormData();
//       // @ts-ignore
//       formData.append(field, {
//         uri,
//         name: `${field}_${Date.now()}.jpg`,
//         type: 'image/jpeg',
//       });

//       const endpoint = truck 
//         ? `/api/trucks/${truck.id}/`
//         : '/api/trucks/';
      
//       const response = await api.patch(endpoint, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setTruck(response.data);
//       Alert.alert('Success', 'Truck information updated successfully');
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       Alert.alert('Error', 'Failed to update truck information');
//     }
//   };

//   const renderDocumentSection = (title: string, field: string, value: string, expiryField?: string) => {
//     const expiryDate = expiryField && truck ? truck[expiryField] : null;
//     const isExpired = expiryDate && new Date(expiryDate) < new Date();
    
//     return (
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>{title}</Text>
//         <View style={styles.documentContainer}>
//           {value ? (
//             <Image 
//               source={{ uri: value }} 
//               style={styles.documentImage} 
//               resizeMode="contain"
//             />
//           ) : (
//             <View style={styles.placeholderContainer}>
//               <Text style={styles.placeholderText}>No {title.toLowerCase()} uploaded</Text>
//             </View>
//           )}
//           {expiryDate && (
//             <Text style={[styles.expiryText, isExpired && styles.expiredText]}>
//               {isExpired ? 'Expired: ' : 'Expires: '}
//               {new Date(expiryDate).toLocaleDateString()}
//             </Text>
//           )}
//           <TouchableOpacity
//             style={styles.uploadButton}
//             onPress={() => pickImage(field)}
//             disabled={!!uploading}
//           >
//             {uploading === field ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Text style={styles.uploadButtonText}>
//                 {value ? 'Update' : 'Upload'}
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#35B468" />
//       </View>
//     );
//   }

//   if (!truck) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.noTruckText}>No truck assigned to you yet.</Text>
//         <Text style={styles.noTruckSubtext}>
//           Please contact support to get a truck assigned to your profile.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.truckName}>
//           {truck.year} {truck.make} {truck.model}
//         </Text>
//         <View style={[
//           styles.statusBadge,
//           { backgroundColor: truck.is_active ? '#35B46820' : '#FF3B3020' }
//         ]}>
//           <Text style={[
//             styles.statusText,
//             { color: truck.is_active ? '#35B468' : '#FF3B30' }
//           ]}>
//             {truck.is_active ? 'Active' : 'Inactive'}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.infoGrid}>
//         <View style={styles.infoItem}>
//           <Text style={styles.infoLabel}>License Plate</Text>
//           <Text style={styles.infoValue}>{truck.license_plate}</Text>
//         </View>
//         <View style={styles.infoItem}>
//           <Text style={styles.infoLabel}>Type</Text>
//           <Text style={styles.infoValue}>
//             {truck.truck_type.replace('_', ' ').toUpperCase()}
//           </Text>
//         </View>
//         <View style={styles.infoItem}>
//           <Text style={styles.infoLabel}>Max Load</Text>
//           <Text style={styles.infoValue}>{truck.max_load} kg</Text>
//         </View>
//       </View>

//       {renderDocumentSection(
//         'Registration Document', 
//         'registration_document', 
//         truck.registration_document,
//         'registration_expiry'
//       )}

//       {renderDocumentSection(
//         'Insurance Document', 
//         'insurance_document', 
//         truck.insurance_document,
//         'insurance_expiry'
//       )}

//       {renderDocumentSection(
//         'Inspection Document', 
//         'inspection_document', 
//         truck.inspection_document,
//         'inspection_expiry'
//       )}

//       <View style={styles.noteContainer}>
//         <Text style={styles.noteTitle}>Important Notes:</Text>
//         <Text style={styles.noteText}>
//           • Keep all documents up to date to avoid service interruptions
//         </Text>
//         <Text style={styles.noteText}>
//           • You will be notified before any documents expire
//         </Text>
//         <Text style={styles.noteText}>
//           • Contact support if you need assistance with document uploads
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FBFBFB',
//     padding: 16,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   noTruckText: {
//     fontFamily: 'Comfortaa-SemiBold',
//     fontSize: 18,
//     color: '#282828',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   noTruckSubtext: {
//     fontFamily: 'Comfortaa-Medium',
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   truckName: {
//     fontFamily: 'Comfortaa-SemiBold',
//     fontSize: 20,
//     color: '#282828',
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginLeft: 12,
//   },
//   statusText: {
//     fontFamily: 'Comfortaa-SemiBold',
//     fontSize: 12,
//   },
//   infoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   infoItem: {
//     width: '50%',
//     marginBottom: 12,
//   },
//   infoLabel: {
//     fontFamily: 'Comfortaa-Medium',
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontFamily: 'Comfortaa-SemiBold',
//     fontSize: 14,
//     color: '#282828',
//   },
//   section: {
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontFamily: 'Comfortaa-SemiBold',
//     fontSize: 16,
//     color: '#282828',
//     marginBottom: 12,
//   },
//   documentContainer: {
//     alignItems: 'center',
//   },
//   documentImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 12,
//     backgroundColor: '#f5f5f5',
//   },
//   placeholderContainer: {
//     width: '100%',
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   placeholderText: {
//     fontFamily: 'Comfortaa-Medium',
//     fontSize: 14,
//     color: '#999',
//   },
//   expiryText: {
//     fontFamily: 'Comfortaa-Medium',
//     fontSize: 12,
//     color: '#35B468',
//     marginBottom: 12,
//   },
//   expiredText: {
//     color: '#FF3B30',
//   },
//   uploadButton: {
//     backgroundColor: '#35B468',
//     borderRadius: 8,
//     padding: 12,
//     width: '100%',
//     alignItems: 'center',
//   },
//   uploadButtonText: {
//     color: '#fff',
//     fontFamily: 'Comfortaa-SemiBold',
//     fontSize: 14,
//   },
//   noteContainer: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 8,
//     padding: 16,
//     marginTop: 8,
//     marginBottom: 20,
//   },
//   noteTitle: {
//     fontFamily: 'Comfortaa-SemiBold',
//     fontSize: 14,
//     color: '#282828',
//     marginBottom: 8,
//   },
//   noteText: {
//     fontFamily: 'Comfortaa-Medium',
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
// });
