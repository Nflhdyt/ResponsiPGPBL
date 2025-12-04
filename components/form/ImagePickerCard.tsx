import { globalStyles } from '@/constants/styles';
import { AppColors } from '@/constants/theme';
import { ImageIcon } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

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
          <ImageIcon size={18} color={AppColors.primary} />
          <Text style={globalStyles.outlineButtonText}>Ganti Foto</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity style={styles.imagePicker} onPress={onPress} disabled={isLoading}>
        <ImageIcon size={32} color={AppColors.primary} />
        <Text style={styles.imagePickerText}>Pilih Foto Kerusakan</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = {
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
    borderColor: AppColors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.inputBackground,
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
    color: AppColors.textSecondary,
  },
};
