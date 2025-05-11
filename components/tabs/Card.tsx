import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { tabStyles } from '@/assets/styles/tabStyles';
import { ThemedView } from '@/components/ThemedView';

interface CardProps {
  title?: string;
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  headerRight?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, onPress, style, headerRight }) => {
  return (
    <TouchableOpacity 
      style={[tabStyles.card, style]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={tabStyles.cardTitle}>{title}</ThemedText>
        {headerRight}
      </ThemedView>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
