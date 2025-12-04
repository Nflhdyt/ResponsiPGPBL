import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import { AppColors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export const FAB = () => {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/forminputlocation')}>
            <Plus size={28} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: AppColors.primary,
        borderRadius: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
            android: {
                elevation: 8,
            },
        }),
        zIndex: 20,
    },
});
