import { AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- WARNA MANUAL ---
const Colors = {
  primary: '#FF3B30', // Merah Utama
  success: '#34C759', // Hijau Sukses
  warning: '#FF9500', // Kuning Peringatan
  background: '#FFFFFF',
  text: '#212121',
  textSecondary: '#666666',
  overlay: 'rgba(0,0,0,0.6)', // Background gelap transparan
  surface: '#F5F5F5',
};

interface CustomAlertProps {
  visible: boolean;
  type?: 'success' | 'warning' | 'error' | 'delete'; // Tambah tipe 'delete' khusus
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type = 'warning',
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Batal',
}) => {
  // Animasi Scale (Pop Up effect)
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Muncul dengan efek membal (Spring)
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset saat tutup
      scaleValue.setValue(0);
      opacityValue.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  // Tentukan Ikon & Warna berdasarkan Tipe
  let IconComponent = Info;
  let themeColor = Colors.primary;
  let iconBgColor = '#FFF5F5'; // Merah muda pudar

  switch (type) {
    case 'success':
      IconComponent = CheckCircle;
      themeColor = Colors.success;
      iconBgColor = '#E8F8EE'; // Hijau muda pudar
      break;
    case 'delete':
      IconComponent = Trash2;
      themeColor = Colors.primary;
      iconBgColor = '#FFF5F5';
      break;
    case 'warning':
      IconComponent = AlertTriangle;
      themeColor = Colors.warning;
      iconBgColor = '#FFF8E1'; // Kuning muda
      break;
    case 'error':
      IconComponent = AlertTriangle;
      themeColor = Colors.primary;
      iconBgColor = '#FFF5F5';
      break;
  }

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.alertBox, 
            { opacity: opacityValue, transform: [{ scale: scaleValue }] }
          ]}
        >
          
          {/* 1. IKON DI TENGAH */}
          <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
            <IconComponent size={32} color={themeColor} strokeWidth={2.5} />
          </View>

          {/* 2. TEKS JUDUL & PESAN */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* 3. TOMBOL AKSI */}
          <View style={styles.buttonContainer}>
            {/* Tombol Cancel (Abu-abu) - Cuma muncul kalau ada onCancel */}
            {onCancel && (
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            {/* Tombol Confirm (Berwarna) */}
            <TouchableOpacity 
              style={[styles.confirmButton, { backgroundColor: themeColor }]} 
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertBox: {
    width: width * 0.85, // 85% lebar layar
    backgroundColor: Colors.background,
    borderRadius: 24, // Rounded banget biar modern
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    // Shadow Elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800', // Extra Bold
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12, // Jarak antar tombol
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});