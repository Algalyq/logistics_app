import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { authStyles } from '@/assets/styles/authStyles';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
}

export function AuthButton({ title, ...props }: AuthButtonProps) {
  return (
    <TouchableOpacity 
      style={authStyles.actionButton} 
      {...props}
    >
      <ThemedText style={authStyles.actionButtonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}
