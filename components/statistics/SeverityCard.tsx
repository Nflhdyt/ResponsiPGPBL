import { AppColors } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SeverityCardProps {
  severity: 'Heavy' | 'Medium' | 'Light';
  count: number;
}

const severityConfig = {
  Heavy: {
    icon: 'alert-triangle' as any,
    color: '#FF0000',
  },
  Medium: {
    icon: 'alert-octagon' as any,
    color: '#FFA500',
  },
  Light: {
    icon: 'alert-circle' as any,
    color: '#FFC700',
  },
};

export const SeverityCard: React.FC<SeverityCardProps> = ({ severity, count }) => {
  const config = severityConfig[severity];

  return (
    <View style={[styles.severityCard, { borderLeftColor: config.color }]}>
      <Feather name={config.icon} size={24} color={config.color} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.severityLabel}>{severity} Damage</Text>
        <Text style={styles.severityCount}>{count} reports</Text>
      </View>
      <View style={[styles.severityBadge, { backgroundColor: config.color }]}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  severityCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 0,
  },
  severityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  severityCount: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  severityBadge: {
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
