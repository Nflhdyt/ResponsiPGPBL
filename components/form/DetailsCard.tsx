import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Warna Manual
const Colors = {
  primary: '#FF3B30',
  textPrimary: '#000000',
  textSecondary: '#666666',
  inputBackground: '#F5F5F5',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  white: '#FFFFFF',
};

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
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Detail Laporan</Text>
    
    <Text style={styles.label}>Tingkat Kerusakan</Text>
    <View style={styles.severityContainer}>
      {(['Light', 'Medium', 'Heavy'] as const).map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.severityButton,
            severity === level && styles.severityButtonActive,
          ]}
          onPress={() => onSeverityChange(level)}
          disabled={isLoading}
        >
          <Text style={[
            styles.severityButtonText, 
            severity === level && styles.severityButtonTextActive
          ]}>
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.label}>Deskripsi</Text>
    <TextInput
      style={styles.textArea}
      placeholder="Contoh: Ada lubang besar di tengah jalan..."
      value={description}
      onChangeText={onDescriptionChange}
      multiline
      numberOfLines={4}
      placeholderTextColor={Colors.textSecondary}
      editable={!isLoading}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
  },
  severityButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  severityButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  severityButtonTextActive: {
    color: Colors.white,
  },
  textArea: {
    minHeight: 100,
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
  },
});