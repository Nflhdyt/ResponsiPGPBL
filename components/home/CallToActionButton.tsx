import { AppColors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CallToActionButton = () => {
    const router = useRouter();
    return (
        <TouchableOpacity
                style={styles.largeButton}
            onPress={() => router.push('/forminputlocation')}
        >
            <MaterialCommunityIcons name="camera" size={28} color="#fff" style={styles.largeButtonIcon} />
            <View>
                <Text style={styles.largeButtonText}>Report Now</Text>
                <Text style={styles.largeButtonSubtext}>Lapor Jalan Rusak</Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    largeButton: {
          backgroundColor: AppColors.primary,
          borderRadius: 25,
          paddingVertical: 14,
          paddingHorizontal: 16,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
    },
    largeButtonIcon: {
        marginRight: 12,
    },
    largeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    largeButtonSubtext: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.9,
    },
    arrowIcon: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 'auto',
    },
});
