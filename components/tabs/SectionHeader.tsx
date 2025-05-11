import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { tabStyles } from '@/assets/styles/tabStyles';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, actionText, onActionPress }: SectionHeaderProps) {
  return (
    <View style={tabStyles.sectionHeader}>
      <ThemedText style={tabStyles.sectionTitle}>{title}</ThemedText>
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <ThemedText style={tabStyles.viewAllText}>{actionText}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}
