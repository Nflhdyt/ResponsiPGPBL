import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/theme';

interface TipCardProps {
  tips: string[];
}

export const TipCard: React.FC<TipCardProps> = ({ tips }) => (
  <View style={styles.card}>
    {tips.map((tip, index) => (
      <Text key={index} style={styles.tipText}>✓ {tip}</Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tipText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
});
