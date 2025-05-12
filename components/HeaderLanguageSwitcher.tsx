import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Language, useTranslation } from '@/translations/useTranslation';
import { COLORS } from '@/assets/styles/authStyles';

export function HeaderLanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kk', label: 'Қазақша' },
    { code: 'ru', label: 'Русский' }
  ];

  const getLanguageCode = (lang: string) => {
    return lang === 'kk' ? 'KZ' : lang === 'ru' ? 'RU' : 'EN';
  };
  
  const renderLanguageItem = ({ item }: { item: { code: string, label: string } }) => (
    <TouchableOpacity 
      style={[styles.languageItem, item.code === language && styles.selectedLanguageItem]}
      onPress={() => {
        changeLanguage(item.code as Language);
        setModalVisible(false);
      }}
    >
      <ThemedText style={[styles.languageItemText, item.code === language && styles.selectedLanguageText]}>
        {getLanguageCode(item.code)} - {item.label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText style={styles.languageText}>
          {getLanguageCode(language)}
        </ThemedText>
      </TouchableOpacity>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={item => item.code}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: {
    fontWeight: '600',
    color: '#FBFBFB',
    fontFamily: 'Comfortaa',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    width: 180,
    marginTop: 100,
    marginRight: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  languageItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedLanguageItem: {
    backgroundColor: 'rgba(53, 180, 104, 0.1)',
  },
  languageItemText: {
    fontWeight: '500',
    color: '#282828',
    fontFamily: 'Comfortaa',
    fontSize: 14,
  },
  selectedLanguageText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  }
});
