import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ActionButtons = () => {
    const router = useRouter();

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
            onPress: () => Alert.alert('About Bengkulu Mulus', 'v1.0\n\nAplikasi pelaporan kerusakan jalan untuk Kota Bengkulu\n\nDeveloped with ❤️'),
        },
    ];

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
