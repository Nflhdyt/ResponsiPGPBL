import { AppColors } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from '../themed-text';

// Define the props for the component
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentProps<typeof Feather>['name'];
  color?: string; // Made color optional with a default value
  style?: ViewStyle; // Allow passing custom styles
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = AppColors.primary, // Default to primary color if not provided
  style 
}) => (
  // The outer View now accepts and merges external styles
  <View style={[styles.statsCard, { borderLeftColor: color }, style]}>
    <Feather name={icon} size={28} color={color} />
    <View style={styles.cardText}>
      <ThemedText type="default" style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText type="title" style={[styles.cardValue, { color: color }]}>{value}</ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,
    // Removed marginBottom to allow grid gap to control spacing
    borderWidth: 1,
    borderColor: AppColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 0,
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 26, // Slightly adjusted for balance
  },
});