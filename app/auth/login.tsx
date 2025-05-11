import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  useEffect(() => {
    // This ensures header is hidden when screen is focused
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLogin = () => {
    // Add authentication logic here
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      style={authStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <ThemedText style={authStyles.title}>{t('login')}</ThemedText>
          <ThemedText style={authStyles.subtitle}>{t('welcomeBack')}</ThemedText>
          
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
          
          <TouchableOpacity style={authStyles.forgotPassword}>
            <ThemedText style={authStyles.highlightedLinkText}>{t('forgotPassword')}</ThemedText>
          </TouchableOpacity>
          
          <AuthButton title={t('signIn')} onPress={handleLogin} />
          
          <View style={authStyles.linkRow}>
            <ThemedText style={authStyles.linkText}>{t('dontHaveAccount')} </ThemedText>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <ThemedText>{t('register')}</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}