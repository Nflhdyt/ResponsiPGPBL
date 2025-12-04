import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';
import { globalStyles } from '@/constants/styles';

interface SubmitButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress, isLoading }) => (
  <TouchableOpacity style={[globalStyles.submitButton, isLoading && globalStyles.submitButtonDisabled]} onPress={onPress} disabled={isLoading}>
    {isLoading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <>
        <Send size={20} color="#fff" />
        <Text style={globalStyles.submitButtonText}>Kirim Laporan</Text>
      </>
    )}
  </TouchableOpacity>
);
