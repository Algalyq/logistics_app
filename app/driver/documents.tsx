import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Modal } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from '@/translations/useTranslation';
import apiClient from '@/api/client';

interface Document {
  id: number;
  document_type: string;
  file: string;
  is_verified: boolean;
  uploaded_at: string;
  verification_message?: string;
}

const getDocumentTypes = (t: any) => [
  { id: 'license', label: t('driversLicense') },
  { id: 'id_card', label: t('idCard') },
  { id: 'vehicle_registration', label: t('vehicleRegistration') },
  { id: 'insurance', label: t('insurance') },
];

export default function DriverDocuments() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [isImageDocument, setIsImageDocument] = useState(false);
  
  const DOCUMENT_TYPES = getDocumentTypes(t);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<any>('/api/driver/documents/');
      // Handle different API response formats
      if (response.results) {
        setDocuments(response.results);
      } else if (response.data) {
        setDocuments(Array.isArray(response.data) ? response.data : response.data.data || []);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert(t('error'), t('failedToLoadDocuments'));
    } finally {
      setLoading(false);
    }
  };

  const pickDocument = async (documentType: string) => {
    try {
      setSelectedDocType(documentType);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        await uploadDocument(result.uri, documentType);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    } finally {
      setSelectedDocType(null);
    }
  };

  const uploadDocument = async (uri: string, documentType: string) => {
    try {
      setUploading(true);
      
      // Get file info to determine the type
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileExtension = uri.split('.').pop()?.toLowerCase() || '';
      let mimeType = 'application/pdf';
      
      // Check if it's an image
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
      }
      
      const formData = new FormData();
      formData.append('document_type', documentType);
      
      // @ts-ignore
      formData.append('file', {
        uri,
        name: `document_${Date.now()}.${fileExtension}`,
        type: mimeType,
      });

      await apiClient.post('/api/driver/documents/', formData);
      
      Alert.alert(t('success'), t('documentUploadedSuccessfully'));
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert(t('error'), t('failedToUploadDocument'));
    } finally {
      setUploading(false);
    }
  };

  const getDocumentStatus = (doc: Document) => {
    if (doc.is_verified) {
      return { text: t('verified'), color: '#35B468' };
    }
    if (doc.verification_message) {
      return { text: t('rejected'), color: '#FF3B30' };
    }
    return { text: t('pendingReview'), color: '#FF9500' };
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#35B468" />
        <ThemedText style={styles.loadingText}>{t('loading')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <ThemedText style={styles.title}>{t('myDocuments')}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('uploadAndManageDocuments')}</ThemedText>
      
      {DOCUMENT_TYPES.map((docType) => {
        const existingDoc = documents.find(doc => doc.document_type === docType.id);
        const status = existingDoc ? getDocumentStatus(existingDoc) : null;
        
        return (
          <View key={docType.id} style={styles.documentCard}>
            <View style={styles.documentHeader}>
              <ThemedText style={styles.documentTitle}>{docType.label}</ThemedText>
              {status && (
                <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
                  <ThemedText style={[styles.statusText, { color: status.color }]}>
                    {status.text}
                  </ThemedText>
                </View>
              )}
            </View>
            
            {existingDoc?.verification_message && !existingDoc.is_verified && (
              <ThemedText style={styles.errorText}>
                {existingDoc.verification_message}
              </ThemedText>
            )}
            
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickDocument(docType.id)}
              disabled={uploading && selectedDocType === docType.id}
            >
              {uploading && selectedDocType === docType.id ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <ThemedText style={styles.uploadButtonText}>
                  {existingDoc ? t('updateDocument') : t('uploadDocument')}
                </ThemedText>
              )}
            </TouchableOpacity>
            
            {existingDoc && (
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => {
                  // Check if document is an image by file extension
                  const url = existingDoc.file;
                  const fileExtension = url.split('.').pop()?.toLowerCase() || '';
                  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
                  
                  setIsImageDocument(isImage);
                  setViewingDocument(url);
                }}
              >
                <ThemedText style={styles.viewButtonText}>{t('viewDocument')}</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
      
      <View style={styles.noteContainer}>
        <ThemedText style={styles.noteTitle}>{t('note')}:</ThemedText>
        <ThemedText style={styles.noteText}>
          • {t('documentsMustBeClearAndValid')}
        </ThemedText>
        <ThemedText style={styles.noteText}>
          • {t('verificationMayTakeTime')}
        </ThemedText>
      </View>
      </ScrollView>
      
      {/* Document Viewer Modal */}
      <Modal
        visible={!!viewingDocument}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewingDocument(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>{t('viewDocument')}</ThemedText>
              <TouchableOpacity onPress={() => setViewingDocument(null)}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            
            {isImageDocument ? (
              <Image 
                source={{ uri: viewingDocument || '' }}
                style={styles.documentImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.pdfPlaceholder}>
                <ThemedText style={styles.pdfText}>{t('pdfPreviewNotAvailable')}</ThemedText>
                <TouchableOpacity 
                  style={styles.openExternalButton}
                  onPress={() => {
                    // Open in external viewer would go here
                    Alert.alert(t('info'), t('openInExternalApp'));
                    setViewingDocument(null);
                  }}
                >
                  <ThemedText style={styles.openExternalButtonText}>{t('openInExternalApp')}</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
  },
  title: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 24,
    color: '#282828',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentTitle: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 16,
    color: '#282828',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 12,
  },
  errorText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 12,
    color: '#FF3B30',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#35B468',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 14,
  },
  viewButton: {
    borderWidth: 1,
    borderColor: '#35B468',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#35B468',
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 14,
  },
  noteContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  noteTitle: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 14,
    color: '#282828',
    marginBottom: 8,
  },
  noteText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontFamily: 'Comfortaa-SemiBold',
    fontSize: 18,
    color: '#282828',
  },
  closeButton: {
    fontSize: 20,
    color: '#666666',
  },
  documentImage: {
    width: '100%',
    height: 400,
  },
  pdfPlaceholder: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  pdfText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  openExternalButton: {
    backgroundColor: '#35B468',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  openExternalButtonText: {
    fontFamily: 'Comfortaa-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
