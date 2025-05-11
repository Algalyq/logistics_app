import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Language, useTranslation } from '@/translations/useTranslation';
import { COLORS } from '@/assets/styles/authStyles';

export function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.languageButton, 
          language === 'kk' && styles.activeLanguage
        ]}
        onPress={() => changeLanguage('kk')}
      >
        <ThemedText style={[
          styles.languageText,
          language === 'kk' && styles.activeLanguageText
        ]}>
          KZ
        </ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.languageButton, 
          language === 'ru' && styles.activeLanguage
        ]}
        onPress={() => changeLanguage('ru')}
      >
        <ThemedText style={[
          styles.languageText,
          language === 'ru' && styles.activeLanguageText
        ]}>
          RU
        </ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.languageButton, 
          language === 'en' && styles.activeLanguage
        ]}
        onPress={() => changeLanguage('en')}
      >
        <ThemedText style={[
          styles.languageText,
          language === 'en' && styles.activeLanguageText
        ]}>
          EN
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    padding: 4,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeLanguage: {
    backgroundColor: COLORS.PRIMARY,
  },
  languageText: {
    fontWeight: '500',
    color: COLORS.TEXT_DARK,
  },
  activeLanguageText: {
    color: 'white',
    fontWeight: '600',
  },
});
