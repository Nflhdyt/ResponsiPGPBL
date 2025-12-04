import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface GuideSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const GuideSection: React.FC<GuideSectionProps> = ({ title, icon: Icon, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Icon size={24} color={AppColors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginLeft: 12,
  },
});
