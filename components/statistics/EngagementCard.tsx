import { AppColors } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EngagementCardProps {
  totalValidations: number;
  averageUrgency: number;
}

export const EngagementCard: React.FC<EngagementCardProps> = ({ totalValidations, averageUrgency }) => (
  <View style={styles.engagementGrid}>
    <View style={styles.engagementItem}>
      <Feather name="thumbs-up" size={28} color={AppColors.primary} />
      <Text style={styles.engagementValue}>{totalValidations}</Text>
      <Text style={styles.engagementLabel}>Total Validations</Text>
    </View>
    <View style={styles.engagementItem}>
      <Feather name="zap" size={28} color={AppColors.primary} />
      <Text style={styles.engagementValue}>{averageUrgency}</Text>
      <Text style={styles.engagementLabel}>Avg Urgency Score</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  engagementGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  engagementItem: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  engagementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 4,
    marginTop: 8,
  },
  engagementLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
});
