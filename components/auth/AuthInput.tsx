import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { authStyles } from '@/assets/styles/authStyles';
import { useTranslation } from '@/translations/useTranslation';

interface AuthInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
}

export function AuthInput({ label, isPassword = false, ...props }: AuthInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  
  if (isPassword) {
    return (
      <View style={authStyles.inputContainer}>
        <ThemedText style={authStyles.inputLabel}>{label}</ThemedText>
        <View style={authStyles.passwordContainer}>
          <TextInput
            style={authStyles.passwordInput}
            secureTextEntry={!isVisible}
            placeholderTextColor="#AAAAAA"
            {...props}
          />
          <TouchableOpacity 
            style={authStyles.eyeIcon}
            onPress={() => setIsVisible(!isVisible)}
          >
            <ThemedText>{isVisible ? '👁️' : '👁️‍🗨️'}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={authStyles.inputContainer}>
      <ThemedText style={authStyles.inputLabel}>{label}</ThemedText>
      <TextInput
        style={authStyles.input}
        placeholderTextColor="#AAAAAA"
        {...props}
      />
    </View>
  );
}
