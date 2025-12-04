import { globalStyles } from '@/constants/styles';
import { AppColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface DetailsCardProps {
  severity: 'Light' | 'Medium' | 'Heavy';
  onSeverityChange: (severity: 'Light' | 'Medium' | 'Heavy') => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  isLoading: boolean;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({
  severity,
  onSeverityChange,
  description,
  onDescriptionChange,
  isLoading,
}) => (
  <View style={globalStyles.card}>
    <Text style={globalStyles.cardTitle}>Detail Laporan</Text>
    <Text style={globalStyles.label}>Tingkat Kerusakan</Text>
    <View style={styles.severityContainer}>
      {(['Light', 'Medium', 'Heavy'] as const).map((level, idx) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.severityButton,
            idx < 2 && { marginRight: 10 },
            severity === level && styles.severityButtonActive,
          ]}
          onPress={() => onSeverityChange(level)}
          disabled={isLoading}
        >
          <Text style={[styles.severityButtonText, severity === level && styles.severityButtonTextActive]}>
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <Text style={globalStyles.label}>Deskripsi</Text>
    <TextInput
      style={styles.textArea}
      placeholder="Contoh: Ada lubang besar di tengah jalan..."
      value={description}
      onChangeText={onDescriptionChange}
      multiline
      placeholderTextColor={AppColors.textSecondary}
    />
  </View>
);

const styles = StyleSheet.create({
  severityContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  } as ViewStyle,
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.border,
    alignItems: 'center',
  } as ViewStyle,
  severityButtonActive: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary,
  } as ViewStyle,
  severityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  } as TextStyle,
  severityButtonTextActive: {
    color: '#FFFFFF',
  } as TextStyle,
  textArea: {
    minHeight: 100,
    backgroundColor: AppColors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: AppColors.textPrimary,
    borderWidth: 1,
    borderColor: AppColors.textSecondary,
    textAlignVertical: 'top',
  } as TextStyle,
});
