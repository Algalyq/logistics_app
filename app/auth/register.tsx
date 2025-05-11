import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, useRouter, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';

// Import shared components and styles
import { authStyles } from '@/assets/styles/authStyles';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { LanguageSwitcher } from '@/components/auth/LanguageSwitcher';
import { useTranslation } from '@/translations/useTranslation';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  useEffect(() => {
    // This ensures header is hidden when screen is focused
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleRegister = () => {
    // Add registration logic here
    router.push('/auth/login');
  };

  return (
    <KeyboardAvoidingView 
      style={authStyles.container} 
    >
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={authStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <LanguageSwitcher />
        
        <View style={authStyles.logoContainer}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={authStyles.logo}
            resizeMode="contain"
          />
          <ThemedText style={authStyles.appName}>{t('appName')}</ThemedText>
        </View>

        <View style={authStyles.formContainer}>
          <ThemedText style={authStyles.title}>{t('createAccount')}</ThemedText>
          <ThemedText style={authStyles.subtitle}>{t('getStarted')}</ThemedText>
          
          <AuthInput
            label={t('fullName')}
            placeholder={t('enterFullName')}
            value={fullName}
            onChangeText={setFullName}
          />
          
          <AuthInput
            label={t('email')}
            placeholder={t('enterEmail')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <AuthInput
            label={t('password')}
            placeholder={t('enterPassword')}
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          
          <AuthInput
            label={t('confirmPassword')}
            placeholder={t('confirmYourPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />
          
          <AuthButton title={t('signUp')} onPress={handleRegister} />
          
          <View style={authStyles.linkRow}>
            <ThemedText style={authStyles.linkText}>{t('alreadyHaveAccount')} </ThemedText>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <ThemedText style={authStyles.highlightedLinkText}>{t('login')}</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}