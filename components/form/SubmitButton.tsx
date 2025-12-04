import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Send } from 'lucide-react-native';

// Warna Manual
const Colors = {
  primary: '#FF3B30',
  white: '#FFFFFF',
};

interface SubmitButtonProps {
  onPress: () => void;
  isLoading: boolean;
  label?: string; // <--- INI KUNCINYA (Tanda tanya artinya optional)
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress, isLoading, label }) => (
  <TouchableOpacity 
    style={[styles.button, isLoading && styles.buttonDisabled]} 
    onPress={onPress} 
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator color={Colors.white} />
    ) : (
      <>
        {/* Ikon cuma muncul kalau labelnya default/kosong */}
        <Send size={20} color={Colors.white} style={{ marginRight: 8 }} />
        {/* Pakai label yang dikirim, atau default "Kirim Laporan" */}
        <Text style={styles.text}>{label || "Kirim Laporan"}</Text>
      </>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 40,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});