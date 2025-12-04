import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/theme';

export const ContactCard = () => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Dinas Pekerjaan Umum Kota Bengkulu</Text>
    <Text style={styles.cardText}>Telepon: (0736) 21XXXX</Text>
    <Text style={styles.cardText}>Email: support@bengkulumulus.com</Text>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
});
