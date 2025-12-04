import { AppColors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Header = () => (
  <View style={styles.headerContainer}>
    <View style={styles.headerTitleContainer}>
      <MaterialCommunityIcons name="road-variant" size={28} color={AppColors.primary} />
      <Text style={styles.headerTitle}>Bengkulu Mulus</Text>
    </View>
    <Text style={styles.headerSubtitle}>Road Damage Reporting System</Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
});
