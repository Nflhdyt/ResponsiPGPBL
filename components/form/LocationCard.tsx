import { Map, MapPin } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Warna Manual
const Colors = {
  primary: '#FF3B30',
  textPrimary: '#000000',
  textSecondary: '#666666',
  inputBackground: '#F5F5F5',
  cardBackground: '#FFFFFF',
};

interface LocationCardProps {
  latitude: string;
  longitude: string;
  onLatitudeChange: (text: string) => void;
  onLongitudeChange: (text: string) => void;
  onGetLocation: () => void;
  onOpenMapPicker: () => void;
  isLoading: boolean;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  onGetLocation,
  onOpenMapPicker,
  isLoading,
}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Lokasi GPS</Text>
    
    <View style={styles.inputGroup}>
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={onLatitudeChange}
        keyboardType="numeric" 
        placeholderTextColor={Colors.textSecondary}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={onLongitudeChange}
        keyboardType="numeric"
        placeholderTextColor={Colors.textSecondary}
        editable={!isLoading}
      />
    </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.outlineButton} onPress={onGetLocation} disabled={isLoading}>
        <MapPin size={18} color={Colors.primary} />
        <Text style={styles.outlineButtonText}>Lokasi Saya</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.outlineButton} onPress={onOpenMapPicker} disabled={isLoading}>
        <Map size={18} color={Colors.primary} />
        <Text style={styles.outlineButtonText}>Pilih Peta</Text>
      </TouchableOpacity>
    </View>
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
  inputGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  outlineButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
});