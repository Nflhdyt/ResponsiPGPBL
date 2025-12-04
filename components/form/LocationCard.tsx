import { globalStyles } from '@/constants/styles';
import { AppColors } from '@/constants/theme';
import { Map, MapPin } from 'lucide-react-native';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  <View style={globalStyles.card}>
    <Text style={globalStyles.cardTitle}>Lokasi GPS</Text>
    <View style={styles.inputGroup}>
      <TextInput
        style={globalStyles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={onLatitudeChange}
        keyboardType="decimal-pad"
        placeholderTextColor={AppColors.textSecondary}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={onLongitudeChange}
        keyboardType="decimal-pad"
        placeholderTextColor={AppColors.textSecondary}
      />
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[globalStyles.outlineButton, { flex: 1 }]} onPress={onGetLocation} disabled={isLoading}>
        <MapPin size={18} color={AppColors.primary} />
        <Text style={globalStyles.outlineButtonText}>Dapatkan Lokasi Saya</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.outlineButton, { flex: 1 }]} onPress={onOpenMapPicker} disabled={isLoading}>
        <Map size={18} color={AppColors.primary} />
        <Text style={globalStyles.outlineButtonText}>Pilih Lewat Peta</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = {
    inputGroup: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
};
