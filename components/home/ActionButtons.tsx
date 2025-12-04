import { CustomAlert } from '@/components/ui/CustomAlert';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ActionButtons = () => {
    const router = useRouter();
    // State untuk mengontrol muncul/hilangnya popup About
    const [aboutVisible, setAboutVisible] = useState(false);

    const buttonsRow1 = [
        {
            icon: 'map-outline',
            text: 'Heat Map',
            onPress: () => router.push('/(tabs)/mapwebview'),
        },
        {
            icon: 'trending-up',
            text: 'Analytics',
            onPress: () => router.push('/(tabs)/statistics'),
        },
    ];

    const buttonsRow2 = [
        {
            icon: 'file-document-outline',
            text: 'Feed',
            onPress: () => router.push('/(tabs)/lokasi'),
        },
        {
            icon: 'information-outline',
            text: 'About',
            // Saat ditekan, munculkan CustomAlert
            onPress: () => setAboutVisible(true),
        },
    ];

    
    const aboutContent = 
        "Bengkulu Mulus adalah aplikasi yang dirancang untuk melaporkan kerusakan infrastruktur jalan di Kota Bengkulu. Aplikasi ini memudahkan masyarakat untuk berkontribusi dalam pemantauan kondisi jalan secara real-time demi mewujudkan infrastruktur yang lebih baik.\n\n" +
        "Dibuat oleh:\n" +
        "Nama: Muhammad Naufal Hidayat\n" +
        "NIM: 23/520500/SV/23249\n" +
        "Sarjana Terapan Sistem Informasi Geografis\n" +
        "Universitas Gadjah Mada\n\n" +
        "Disusun untuk memenuhi Responsi\n" +
        "Praktikum Pemrograman Geospasial: Perangkat Bergerak Lanjut (SVIG223542)\n" +
        "Tahun 2025";

    return (
        <View>
            <View style={styles.buttonRow}>
                {buttonsRow1.map((button, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.halfButton}
                        onPress={button.onPress}
                    >
                        <MaterialCommunityIcons name={button.icon as any} size={24} color="#FF3B30" />
                        <Text style={styles.buttonTextSecondary}>{button.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.buttonRow}>
                {buttonsRow2.map((button, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.halfButton}
                        onPress={button.onPress}
                    >
                        <MaterialCommunityIcons name={button.icon as any} size={24} color="#FF3B30" />
                        <Text style={styles.buttonTextSecondary}>{button.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* --- CUSTOM ALERT UNTUK ABOUT --- */}
            <CustomAlert 
                visible={aboutVisible}
                type="success" 
                title="Apa itu Bengkulu Mulus?"
                message={aboutContent}
                confirmText="Close"
                onConfirm={() => setAboutVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    halfButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginHorizontal: 4,
    },
    buttonTextSecondary: {
        color: '#212121',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 8,
    },
});