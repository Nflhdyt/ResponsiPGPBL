import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon }) => (
  <View style={styles.featureItem}>
    <Icon size={24} color={AppColors.primary} />
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    featureContent: {
        flex: 1,
        marginLeft: 16,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.textPrimary,
        marginBottom: 4,
    },
    cardText: {
        fontSize: 14,
        color: AppColors.textSecondary,
        lineHeight: 20,
    },
});
