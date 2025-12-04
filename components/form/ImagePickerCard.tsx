import { globalStyles } from '@/constants/styles';
// import { AppColors } from '@/constants/theme'; // <-- INI YANG BIKIN ERROR
// Kita import Image dari lucide tapi ganti nama jadi ImageIcon biar gak bentrok
import { Image as ImageIcon } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- WARNA MANUAL (ANTI ERROR) ---
const Colors = {
  primary: '#FF3B30',
  inputBackground: '#F5F5F5',
  textSecondary: '#666666',
};

interface ImagePickerCardProps {
  imageUri: string | null;
  onPress: () => void;
  isLoading: boolean;
}

export const ImagePickerCard: React.FC<ImagePickerCardProps> = ({ imageUri, onPress, isLoading }) => (
  <View style={globalStyles.card}>
    <Text style={globalStyles.cardTitle}>Foto Laporan</Text>
    {imageUri ? (
      <View>
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        <TouchableOpacity style={globalStyles.outlineButton} onPress={onPress} disabled={isLoading}>
          <ImageIcon size={18} color={Colors.primary} />
          <Text style={globalStyles.outlineButtonText}>Ganti Foto</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity style={styles.imagePicker} onPress={onPress} disabled={isLoading}>
        <ImageIcon size={32} color={Colors.primary} />
        <Text style={styles.imagePickerText}>Pilih Foto Kerusakan</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePicker: {
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});