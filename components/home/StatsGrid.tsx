import { AppColors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface StatsGridProps {
  stats: {
    totalReports: number;
    criticalRoads: number;
    verifiedReports: number;
    averageUrgency: number;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const router = useRouter();

  const statItems = [
    {
      icon: 'chart-box-outline',
      value: stats.totalReports,
      label: 'Total',
      color: AppColors.primary,
      onPress: () => router.push('/(tabs)/lokasi'),
    },
    {
      icon: 'alert-circle-outline',
      value: stats.criticalRoads,
      label: 'Critical',
      color: AppColors.primary,
      onPress: () => Alert.alert('Critical Roads', `${stats.criticalRoads} jalan membutuhkan perbaikan segera`),
    },
    {
      icon: 'check-decagram-outline',
      value: stats.verifiedReports,
      label: 'Verified',
      color: AppColors.primary,
      onPress: () => router.push('/(tabs)/statistics'),
    },
    {
      icon: 'flash-outline',
      value: stats.averageUrgency,
      label: 'Urgency',
      color: AppColors.primary,
      onPress: () => Alert.alert('Engagement', `Rata-rata urgency score: ${stats.averageUrgency}`),
    }
  ];

  return (
    <View style={styles.statsGrid}>
      {statItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.statCard} onPress={item.onPress}>
          <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
          <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
});
